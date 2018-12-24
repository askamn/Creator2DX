"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var AssetDB_1 = require("./AssetDB");
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    function Label() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = null;
        _this.fontSize = null;
        _this.lineHeight = null;
        _this.textColor = null;
        return _this;
    }
    Label.prototype.CreateWithData = function (cclabel, color) {
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
    };
    Label.prototype.setTextWithSystemFont = function (text, fontSize) {
        this.text = text;
        this.fontSize = fontSize * this.scaleX;
        this.cppString = "auto " + this.name + " = cocos2d::Label::createWithSystemFont(\"" + text + "\", \"arial\", " + this.fontSize + ");\n";
    };
    Label.prototype.setOverflow = function (overflow) {
        this.overflow = overflow;
        if (!this.overflow) {
            return;
        }
        this.cppString += this.name + "->setOverflow(cocos2d::Label::Overflow::" + Label.OVERFLOW_TYPE[overflow] + ");\n";
    };
    Label.prototype.setHorizontalAlignment = function (alignment) {
        this.horizontalAlignment = alignment;
        this.cppString += this.name + "->setHorizontalAlignment(cocos2d::TextHAlignment::" + Label.H_ALIGNMENTS[alignment] + ");\n";
    };
    Label.prototype.setVerticalAlignment = function (alignment) {
        this.verticalAlignment = alignment;
        this.cppString += this.name + "->setVerticalAlignment(cocos2d::TextVAlignment::" + Label.V_ALIGNMENTS[alignment] + ");\n";
    };
    Label.prototype.setText = function (text, fontUUID, fontSize) {
        this.text = text;
        this.fontSize = fontSize * this.scaleX;
        var font = AssetDB_1.AssetDB.i().GetAsset(fontUUID);
        this.cppString = "auto " + this.name + " = cocos2d::Label::createWithTTF(\"" + text + "\", \"" + font + "\", " + this.fontSize + ");\n";
    };
    Label.prototype.setLineHeight = function (lineHeight) {
        this.lineHeight = lineHeight * this.scaleX;
        this.cppString += this.name + "->setLineHeight(" + this.lineHeight + ");\n";
    };
    Label.prototype.setTextColor = function (color) {
        this.textColor = { r: color.r, g: color.g, b: color.b, a: color.a };
        this.cppString += this.name + "->setTextColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
    };
    // Shamelessly copied from cocos-creator-cocos-2dx project
    Label.H_ALIGNMENTS = ['LEFT', 'CENTER', 'RIGHT'];
    Label.V_ALIGNMENTS = ['TOP', 'CENTER', 'BOTTOM'];
    Label.OVERFLOW_TYPE = ['NONE', 'CLAMP', 'SHRINK', 'RESIZEHEIGHT'];
    return Label;
}(Node_1.Node));
exports.Label = Label;
