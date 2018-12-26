"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
const AssetDB_1 = require("./AssetDB");
class Label extends Node_1.Node {
    constructor() {
        super(...arguments);
        this.text = null;
        this.fontSize = null;
        this.lineHeight = null;
        this.textColor = null;
    }
    Create(data = null) {
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
    SetProperties(cclabel, color) {
        if (cclabel._isSystemFontUsed) {
            this.setTextWithSystemFont(cclabel._string, cclabel._fontSize);
        }
        else {
            this.setText(cclabel._string, cclabel._N$file.__uuid__, cclabel._fontSize);
        }
        this.setLineHeight(cclabel._lineHeight);
        this.setTextColor(color);
        this.setHorizontalAlignment(cclabel._N$horizontalAlign);
        this.setVerticalAlignment(cclabel._N$verticalAlign);
        this.setOverflow(cclabel._N$overflow);
        //this.cppString = "auto " + this.name + " = cocos2d::Label::create(\"" + "sprites/rect_curved1.png" + "\");\n";
    }
    setText(text, fontUUID, fontSize) {
        this.createVariableName();
        this.text = text;
        this.fontSize = fontSize * this.scaleX;
        let font = AssetDB_1.AssetDB.i().GetAsset(fontUUID);
        this.cppString = this.getVariableDeclaration() + " = cocos2d::Label::createWithTTF(\"" + text + "\", \"" + font + "\", " + this.fontSize + ");\n";
    }
    setTextWithSystemFont(text, fontSize) {
        this.createVariableName();
        this.text = text;
        this.fontSize = fontSize * this.scaleX;
        this.cppString = this.getVariableDeclaration() + " = cocos2d::Label::createWithSystemFont(\"" + text + "\", \"arial\", " + this.fontSize + ");\n";
    }
    setOverflow(overflow) {
        this.overflow = overflow;
        if (!this.overflow) {
            return;
        }
        this.cppString += this.variableName + "->setOverflow(cocos2d::Label::Overflow::" + Label.OVERFLOW_TYPE[overflow] + ");\n";
    }
    setHorizontalAlignment(alignment) {
        this.horizontalAlignment = alignment;
        this.cppString += this.variableName + "->setHorizontalAlignment(cocos2d::TextHAlignment::" + Label.H_ALIGNMENTS[alignment] + ");\n";
    }
    setVerticalAlignment(alignment) {
        this.verticalAlignment = alignment;
        this.cppString += this.variableName + "->setVerticalAlignment(cocos2d::TextVAlignment::" + Label.V_ALIGNMENTS[alignment] + ");\n";
    }
    setLineHeight(lineHeight) {
        this.lineHeight = lineHeight * this.scaleX;
        // TODO: Find proper fix for label's lineheight
        this.cppString += "//" + this.variableName + "->setLineHeight(" + this.lineHeight + ");\n";
    }
    setTextColor(color) {
        this.textColor = { r: color.r, g: color.g, b: color.b, a: color.a };
        this.cppString += this.variableName + "->setTextColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
    }
}
// Shamelessly copied from cocos-creator-cocos-2dx project
Label.H_ALIGNMENTS = ['LEFT', 'CENTER', 'RIGHT'];
Label.V_ALIGNMENTS = ['TOP', 'CENTER', 'BOTTOM'];
Label.OVERFLOW_TYPE = ['NONE', 'CLAMP', 'SHRINK', 'RESIZEHEIGHT'];
exports.Label = Label;
