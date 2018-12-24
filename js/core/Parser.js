"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Node_1 = require("./Node");
var Sprite_1 = require("./Sprite");
var ImageView_1 = require("./ImageView");
var path_1 = require("path");
var AssetDB_1 = require("./AssetDB");
var Label_1 = require("./Label");
var Button_1 = require("./Button");
var config_1 = require("../config");
var ScrollView_1 = require("./ScrollView");
var Components;
(function (Components) {
    Components[Components["Sprite"] = 1] = "Sprite";
    Components[Components["Button"] = 2] = "Button";
    Components[Components["Label"] = 3] = "Label";
    Components[Components["Widget"] = 4] = "Widget";
    Components[Components["ScrollView"] = 5] = "ScrollView";
})(Components || (Components = {}));
var COCOS_2DX_DESIGN_RESOLUTION_WIDTH = 360;
var COCOS_2DX_DESIGN_RESOLUTION_HEIGHT = 640;
var CREATOR_DESIGN_RESOLUTION_WIDTH = 720;
var CREATOR_DESIGN_RESOLUTION_HEIGHT = 1280;
var SCALE_X = COCOS_2DX_DESIGN_RESOLUTION_WIDTH / CREATOR_DESIGN_RESOLUTION_WIDTH;
var SCALE_Y = COCOS_2DX_DESIGN_RESOLUTION_HEIGHT / CREATOR_DESIGN_RESOLUTION_HEIGHT;
var Parser = /** @class */ (function () {
    function Parser(filePath) {
        var data = null;
        // Try to open the file
        try {
            data = fs_1.readFileSync(filePath, 'utf-8');
        }
        catch (e) {
            console.log("File open error: " + filePath + "\nVerify that the file exists.");
            process.exit();
        }
        if (data === null) {
            console.log("File read error: " + filePath + "\nFailed to read file.");
            process.exit();
        }
        if (data.length === 0) {
            console.log("File read error: " + filePath + "\nEmpty file supplied.");
            process.exit();
        }
        this.json = JSON.parse(data);
        this.output = "";
        this.nodeNameCache = {};
        // Make sure that the asset database exists
        var absolutePathBits = path_1.resolve(filePath).split('/');
        this.libraryFolder = absolutePathBits.slice(0, absolutePathBits.length - 1).join('/') + '/library';
        if (!fs_1.existsSync(this.libraryFolder)) {
            console.log("Asset library folder does not exist in the prefab directory.\nPlease make sure that you copy the library directory of your Cocos Creator project in the sample as the input prefab.");
            process.exit();
        }
        AssetDB_1.AssetDB.i().LoadAssetDB(this.libraryFolder);
    }
    Parser.prototype.Parse = function () {
        var object = this.json[0];
        // Verify that the type is a cc.Prefab
        if (object.__type__ != 'cc.Prefab') {
            console.log("Not a valid prefab");
            process.exit();
        }
        for (var key in this.json) {
            if (this.json[key]._name) {
                this.json[key].__name = this.json[key]._name;
            }
        }
        this.className = this.json[1]._name;
        // Assumption, this is the root node
        this.parseNode(this.json[1], true);
        var replacements = {
            '{%CLASSNAME%}': this.className,
            '{%PARSER_OUTPUT%}': this.output,
            '{%NAMESPACE%}': config_1.Config.Namespace,
        };
        this.headerFile = config_1.Config.HeaderTemplate.replace(/{%\w+%}/g, function (all) {
            return replacements[all] || all;
        });
        this.cppFile = config_1.Config.CPPTemplate.replace(/{%\w+%}/g, function (all) {
            return replacements[all] || all;
        });
    };
    Parser.prototype.camelize = function (str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    };
    Parser.prototype.isSprite = function (component) {
        return component.__type__ == 'cc.Sprite';
    };
    Parser.prototype.isButton = function (component) {
        return component.__type__ == 'cc.Button';
    };
    Parser.prototype.isLabel = function (component) {
        return component.__type__ == 'cc.Label';
    };
    Parser.prototype.isScrollView = function (component) {
        return component.__type__ == 'cc.ScrollView';
    };
    Parser.prototype.isNode = function (component) {
        return component.__type__ == 'cc.Node';
    };
    Parser.prototype.hasButtonComponent = function (object) {
        for (var i = 0; i < object._components.length; ++i) {
            var component = this.json[object._components[i].__id__];
            if (this.isButton(component)) {
                return true;
            }
        }
        return false;
    };
    Parser.prototype.parseScrollView = function (object, component, parent) {
        var scrollview = new ScrollView_1.ScrollView(object._name, SCALE_X, SCALE_Y);
        // Only parse the sprite if it has a sprite frame
        scrollview.parent = parent;
        scrollview.Create(object);
        scrollview.SetProperties(component);
        scrollview.setInnerContainerSize(this.json[component.content.__id__]);
        this.output += scrollview.GetCPPString();
        return scrollview;
    };
    Parser.prototype.parseSprite = function (object, component, parent) {
        var sprite = null;
        switch (component._type) {
            // Simple:
            case 0:
                {
                    sprite = new Sprite_1.Sprite(object._name, SCALE_X, SCALE_Y);
                }
                break;
            // Sliced:
            case 1: {
                sprite = new ImageView_1.ImageView(object._name, SCALE_X, SCALE_Y);
            }
        }
        // Only parse the sprite if it has a sprite frame
        if (component._spriteFrame) {
            sprite.parent = parent;
            sprite.spriteFrameUUID = component._spriteFrame.__uuid__;
            sprite.Create(object);
            this.output += sprite.GetCPPString();
        }
        else {
            console.warn("Spriteframe of sprite is undefined or null");
        }
        return sprite;
    };
    Parser.prototype.parseButton = function (object, parent) {
        var spriteFrameUUID = null;
        var buttonText = null;
        var button = null;
        var textColor = null;
        var ccsprite;
        var cclabel = null;
        // First find the sprite
        for (var i = 0; i < object._components.length; ++i) {
            var component = this.json[object._components[i].__id__];
            if (this.isSprite(component)) {
                spriteFrameUUID = component._spriteFrame.__uuid__;
            }
        }
        // If the sprite frame uuid is still null, try find a "base" node with a sprite component
        for (var i = 0; i < object._children.length; ++i) {
            var child = this.json[object._children[i].__id__];
            if (child.__name == "base") {
                spriteFrameUUID = this.getComponent(child, Components.Sprite)._spriteFrame.__uuid__;
            }
            else if (child.__name == "label") {
                cclabel = this.getComponent(child, Components.Label);
                textColor = child._color;
            }
        }
        if (cclabel == null || spriteFrameUUID == null) {
            console.warn("Missing text or sprite frame for cc.Button.", buttonText, spriteFrameUUID);
            return null;
        }
        // Create a new label
        var label = new Label_1.Label(object._name + "_label", SCALE_X, SCALE_Y);
        label.CreateWithData(cclabel, textColor);
        this.output += label.GetCPPString();
        button = new Button_1.Button(object._name, SCALE_X, SCALE_Y);
        button.spriteFrameUUID = spriteFrameUUID;
        button.parent = parent;
        button.Create(object);
        button.setTextLabel(label.name);
        this.output += button.GetCPPString();
        return button;
    };
    Parser.prototype.getComponent = function (object, type) {
        switch (type) {
            case Components.Sprite:
                {
                    for (var i = 0; i < object._components.length; ++i) {
                        var component = this.json[object._components[i].__id__];
                        if (this.isSprite(component)) {
                            return component;
                        }
                    }
                }
                break;
            case Components.Label:
                {
                    for (var i = 0; i < object._components.length; ++i) {
                        var component = this.json[object._components[i].__id__];
                        if (this.isLabel(component)) {
                            return component;
                        }
                    }
                }
                break;
        }
        return null;
    };
    Parser.prototype.parseNode = function (object, isRoot, parent) {
        if (isRoot === void 0) { isRoot = false; }
        if (parent === void 0) { parent = null; }
        if (this.isNode(object)) {
            object._name = this.camelize(object._name);
            object.__name = object._name;
            if (Object.keys(this.nodeNameCache).indexOf(object._name) > -1) {
                this.nodeNameCache[object._name]++;
                object._name += this.nodeNameCache[object._name].toString();
            }
            else {
                this.nodeNameCache[object._name] = 0;
            }
            var isParsed = false;
            var isButton = false;
            var currentNode = null;
            // First check if this has a button component
            if (this.hasButtonComponent(object)) {
                isParsed = true;
                isButton = true;
                currentNode = this.parseButton(object, parent);
            }
            else {
                // Parse components
                for (var i = 0; i < object._components.length; ++i) {
                    var component = this.json[object._components[i].__id__];
                    if (this.isSprite(component) && !isParsed) {
                        isParsed = true;
                        currentNode = this.parseSprite(object, component, parent);
                    }
                    else if (this.isScrollView(component) && !isParsed) {
                        isParsed = true;
                        currentNode = this.parseScrollView(object, component, parent);
                    }
                }
            }
            if (!isParsed) {
                var node = new Node_1.Node((isRoot ? "this" : object._name), SCALE_X, SCALE_Y);
                node.parent = parent;
                node.Create(object);
                currentNode = node;
                this.output += node.GetCPPString();
            }
            if (currentNode) {
                // Parse children
                for (var i = 0; i < object._children.length; ++i) {
                    var child = this.json[object._children[i].__id__];
                    // If this node had a button component, we would have already parsed their label and base child nodes
                    if (isButton && child.__name == "base" || child.__name == "label") {
                        continue;
                    }
                    this.parseNode(child, false, currentNode);
                    this.output += currentNode.addChild(child._name);
                }
            }
        }
    };
    Parser.prototype.GetOutput = function () {
        return this.output;
    };
    Parser.prototype.GetClassName = function () {
        return this.className;
    };
    Parser.prototype.GetHeaderFileContents = function () {
        return this.headerFile;
    };
    Parser.prototype.GetCPPFileContents = function () {
        return this.cppFile;
    };
    return Parser;
}());
exports.Parser = Parser;
