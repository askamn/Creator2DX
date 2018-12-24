"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node = /** @class */ (function () {
    function Node(name, scaleX, scaleY) {
        if (name == "this") {
            this.parent = null;
        }
        this.name = name;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.cppString = "";
    }
    Node.prototype.setPosition = function (position) {
        this.position = { x: position.x, y: position.y };
        this.position.x *= this.scaleX;
        this.position.y *= this.scaleY;
        if (this.parent) {
            this.cppString += this.name + "->setPosition(" + this.position.x;
            this.cppString += " + " + this.parent.name + "->getContentSize().width / 2.0f, " + this.position.y;
            this.cppString += " + " + this.parent.name + "->getContentSize().height / 2.0f";
            this.cppString += ");\n";
        }
        else {
            this.cppString += this.name + "->setPosition(" + this.position.x + " + this->getParent()->getContentSize().width / 2.0f, " + this.position.y + " + this->getParent()->getContentSize().height / 2.0f);\n";
        }
    };
    Node.prototype.setContentSize = function (size) {
        this.size = { width: size.width, height: size.height };
        // Do not return anything if the values are default
        if (size.width == 0 && size.height == 0) {
            return;
        }
        this.size.width *= this.scaleX;
        this.size.height *= this.scaleY;
        this.cppString += this.name + "->setContentSize(cocos2d::Size(" + this.size.width + ", " + this.size.height + "));\n";
    };
    Node.prototype.setAnchorPoint = function (anchor) {
        this.anchor = { x: anchor.x, y: anchor.y };
        // Do not return anything if the values are default
        if (anchor.x == 0 && anchor.y == 0) {
            return;
        }
        this.cppString += this.name + "->setAnchorPoint(cocos2d::Vec2(" + anchor.x + ", " + anchor.y + "));\n";
    };
    Node.prototype.setScale = function (scale) {
        this.scale = { x: scale.x, y: scale.y };
        // Do not return anything if the values are default
        if (scale.x == 1 && scale.y == 1) {
            return;
        }
        this.cppString += this.name + "->setScale(" + scale.x + ", " + scale.y + ");\n";
    };
    Node.prototype.setColor = function (color) {
        this.color = { r: color.r, g: color.g, b: color.b, a: color.a };
        // Do not return anything if the values are default
        if (color.r == 255 && color.g == 255 && color.b == 255) {
            return;
        }
        this.cppString += this.name + "->setColor(cocos2d::Color3B(" + color.r + ", " + color.g + ", " + color.b + "));\n";
    };
    Node.prototype.setOpacity = function (opacity) {
        this.opacity = opacity;
        // Do not return anything if the values are default
        if (opacity == 255) {
            return;
        }
        this.cppString += this.name + "->setOpacity(" + opacity + ");\n";
    };
    Node.prototype.setRotation = function (rotation) {
        this.rotation = rotation;
        // Do not return anything if the values are default
        if (rotation == 0) {
            return;
        }
        this.cppString += this.name + "->setRotation(" + rotation + ");\n";
    };
    Node.prototype.setSkew = function (skewX, skewY) {
        this.skewX = skewX * this.scaleX;
        this.skewY = skewY * this.scaleY;
        if (this.skewX == 0 && this.skewY == 0) {
            return;
        }
        this.cppString += this.name + "->setSkewX(" + this.skewX + ");\n";
        this.cppString += this.name + "->setSkewY(" + this.skewY + ");\n";
    };
    Node.prototype.setSkewX = function (skewX) {
        this.skewX = skewX * this.scaleX;
        if (this.skewX == 0) {
            return;
        }
        this.cppString += this.name + "->setSkewX(" + this.skewX + ");\n";
    };
    Node.prototype.setSkewY = function (skewY) {
        this.skewY = skewY * this.scaleY;
        if (this.skewY == 0) {
            return;
        }
        this.cppString += this.name + "->setSkewY(" + this.skewY + ");\n";
    };
    Node.prototype.addChild = function (child) {
        return this.name + "->addChild(" + child + ");\n";
    };
    Node.prototype.Create = function (data) {
        if (data === void 0) { data = null; }
        if (this.name != "this") {
            this.cppString = "auto " + this.name + " = cocos2d::Node::create();\n";
        }
        if (data) {
            this.setPosition(data._position);
            this.setRotation(data._rotationX);
            this.setScale(data._scale);
            this.setAnchorPoint(data._anchorPoint);
            this.setContentSize(data._contentSize);
            this.setColor(data._color);
            this.setOpacity(data._opacity);
            this.setSkew(data._skewX, data._skewY);
        }
    };
    Node.prototype.GetCPPString = function () {
        return this.cppString + "\n";
    };
    return Node;
}());
exports.Node = Node;
