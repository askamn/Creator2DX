"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var Sprite_1 = require("./Sprite");
var ImageView_1 = require("./ImageView");
var COCOS_2DX_DESIGN_RESOLUTION_WIDTH = 360;
var COCOS_2DX_DESIGN_RESOLUTION_HEIGHT = 640;
var CREATOR_DESIGN_RESOLUTION_WIDTH = 720;
var CREATOR_DESIGN_RESOLUTION_HEIGHT = 1280;
var SCALE_X = COCOS_2DX_DESIGN_RESOLUTION_WIDTH / CREATOR_DESIGN_RESOLUTION_WIDTH;
var SCALE_Y = COCOS_2DX_DESIGN_RESOLUTION_HEIGHT / CREATOR_DESIGN_RESOLUTION_HEIGHT;
var Header = "#pragma once\n\n#include \"cocos2d.h\"\n#include \"ui/CocosGUI.h\"\n\nnamespace MyAwesomeGame\n{\n\nclass {%CLASSNAME%} : public cocos2d::Node\n{\npublic:\n\tvirtual bool init() override;\n\tCREATE_FUNC({%CLASSNAME%});\n\t\n\tvoid InitChildren();\n};\n\n}";
var Class = "#include \"CharacterSelectorUI.h\"\n\nnamespace MyAwesomeGame {\n\nbool {%CLASSNAME%}::init()\n{\n\tif (!cocos2d::Node::init())\n\t{\n\t\treturn false;\n\t}\n\t\n\treturn true;\n}\n\t\nvoid {%CLASSNAME%}::InitChildren()\n{\n\t{%PARSER_OUTPUT%}\n}\n\t\n}\n";
var Parser = /** @class */ (function () {
    function Parser(data) {
        this.json = JSON.parse(data);
        this.output = "";
        this.nodeNameCache = {};
    }
    Parser.prototype.Parse = function () {
        var object = this.json[0];
        // Verify that the type is a cc.Prefab
        if (object.__type__ != 'cc.Prefab') {
            console.log("Not a valid prefab");
            process.exit();
        }
        this.className = this.json[1]._name;
        // Assumption, this is the root node
        this.parseNode(this.json[1], true);
        var replacements = {
            '{%CLASSNAME%}': this.className,
            '{%PARSER_OUTPUT%}': this.output,
        };
        this.headerFile = Header.replace(/{%\w+%}/g, function (all) {
            return replacements[all] || all;
        });
        this.cppFile = Class.replace(/{%\w+%}/g, function (all) {
            return replacements[all] || all;
        });
    };
    Parser.prototype.camelize = function (str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    };
    Parser.prototype.parseNode = function (object, isRoot, parent) {
        if (isRoot === void 0) { isRoot = false; }
        if (parent === void 0) { parent = null; }
        if (object.__type__ == 'cc.Node') {
            object._name = this.camelize(object._name);
            if (Object.keys(this.nodeNameCache).indexOf(object._name) > -1) {
                this.nodeNameCache[object._name]++;
                object._name += this.nodeNameCache[object._name].toString();
            }
            else {
                this.nodeNameCache[object._name] = 0;
            }
            var isParsed = false;
            var currentNode = null;
            // Parse components
            for (var i = 0; i < object._components.length; ++i) {
                var component = this.json[object._components[i].__id__];
                if (component.__type__ == 'cc.Sprite' && !isParsed) {
                    isParsed = true;
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
                    sprite.parent = parent;
                    sprite.Create();
                    sprite.setPosition(object._position);
                    sprite.setScale(object._scale);
                    sprite.setContentSize(object._contentSize);
                    sprite.setAnchorPoint(object._anchorPoint);
                    sprite.setColor(object._color);
                    sprite.setOpacity(object._opacity);
                    sprite.setRotation(object._rotationX);
                    currentNode = sprite;
                    this.output += sprite.GetCPPString();
                }
            }
            if (!isParsed) {
                var node = new Node_1.Node((isRoot ? "this" : object._name), SCALE_X, SCALE_Y);
                node.parent = parent;
                node.Create();
                node.setPosition(object._position);
                node.setScale(object._scale);
                node.setContentSize(object._contentSize);
                node.setAnchorPoint(object._anchorPoint);
                node.setColor(object._color);
                node.setOpacity(object._opacity);
                node.setRotation(object._rotationX);
                currentNode = node;
                this.output += node.GetCPPString();
            }
            // Parse children
            for (var i = 0; i < object._children.length; ++i) {
                var child = this.json[object._children[i].__id__];
                this.parseNode(child, false, currentNode);
                this.output += currentNode.addChild(child._name);
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
