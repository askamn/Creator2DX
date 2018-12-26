"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(name, scaleX, scaleY, blockScoped = false) {
        if (name == "this") {
            this.parent = null;
        }
        this.name = name;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.blockScoped = blockScoped;
        this.cppString = "";
    }
    Create(data = null) {
        if (this.name != "this") {
            this.createVariableName();
            this.cppString = this.getVariableDeclaration() + " = cocos2d::Node::create();\n";
        }
        else {
            this.variableName = "this";
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
    }
    createVariableName() {
        if (this.blockScoped) {
            this.variableName = this.name;
        }
        else {
            this.variableName = "m_" + this.name;
        }
    }
    getVariableDeclaration() {
        return (this.blockScoped ? "auto " : "") + this.variableName;
    }
    setPosition(position) {
        this.position = { x: position.x, y: position.y };
        this.position.x *= this.scaleX;
        this.position.y *= this.scaleY;
        if (this.parent) {
            this.cppString += this.variableName + "->setPosition(" + this.position.x;
            this.cppString += " + " + this.parent.variableName + "->getContentSize().width / 2.0f, " + this.position.y;
            this.cppString += " + " + this.parent.variableName + "->getContentSize().height / 2.0f";
            this.cppString += ");\n";
        }
        else {
            this.cppString += this.variableName + "->setPosition(" + this.position.x + " + this->getParent()->getContentSize().width / 2.0f, " + this.position.y + " + this->getParent()->getContentSize().height / 2.0f);\n";
        }
    }
    setContentSize(size) {
        this.size = { width: size.width, height: size.height };
        // Do not return anything if the values are default
        if (size.width == 0 && size.height == 0) {
            return;
        }
        this.size.width *= this.scaleX;
        this.size.height *= this.scaleY;
        this.cppString += this.variableName + "->setContentSize(cocos2d::Size(" + this.size.width + ", " + this.size.height + "));\n";
    }
    setAnchorPoint(anchor) {
        this.anchor = { x: anchor.x, y: anchor.y };
        // Do not return anything if the values are default
        if (anchor.x == 0 && anchor.y == 0) {
            return;
        }
        this.cppString += this.variableName + "->setAnchorPoint(cocos2d::Vec2(" + anchor.x + ", " + anchor.y + "));\n";
    }
    setScale(scale) {
        this.scale = { x: scale.x, y: scale.y };
        // Do not return anything if the values are default
        if (scale.x == 1 && scale.y == 1) {
            return;
        }
        this.cppString += this.variableName + "->setScale(" + scale.x + ", " + scale.y + ");\n";
    }
    setColor(color) {
        this.color = { r: color.r, g: color.g, b: color.b, a: color.a };
        // Do not return anything if the values are default
        if (color.r == 255 && color.g == 255 && color.b == 255) {
            return;
        }
        this.cppString += this.variableName + "->setColor(cocos2d::Color3B(" + color.r + ", " + color.g + ", " + color.b + "));\n";
    }
    setOpacity(opacity) {
        this.opacity = opacity;
        // Do not return anything if the values are default
        if (opacity == 255) {
            return;
        }
        this.cppString += this.variableName + "->setOpacity(" + opacity + ");\n";
    }
    setRotation(rotation) {
        this.rotation = rotation;
        // Do not return anything if the values are default
        if (!rotation) {
            return;
        }
        this.cppString += this.variableName + "->setRotation(" + rotation + ");\n";
    }
    setSkew(skewX, skewY) {
        this.skewX = skewX * this.scaleX;
        this.skewY = skewY * this.scaleY;
        if (this.skewX == 0 && this.skewY == 0) {
            return;
        }
        this.cppString += this.variableName + "->setSkewX(" + this.skewX + ");\n";
        this.cppString += this.variableName + "->setSkewY(" + this.skewY + ");\n";
    }
    setSkewX(skewX) {
        this.skewX = skewX * this.scaleX;
        if (this.skewX == 0) {
            return;
        }
        this.cppString += this.variableName + "->setSkewX(" + this.skewX + ");\n";
    }
    setSkewY(skewY) {
        this.skewY = skewY * this.scaleY;
        if (this.skewY == 0) {
            return;
        }
        this.cppString += this.variableName + "->setSkewY(" + this.skewY + ");\n";
    }
    addChild(child) {
        return this.variableName + "->addChild(" + child + ");\n";
    }
    GetCPPString() {
        return this.cppString + "\n";
    }
}
exports.Node = Node;
