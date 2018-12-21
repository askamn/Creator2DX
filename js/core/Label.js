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
    Label.prototype.Create = function () {
        //this.cppString = "auto " + this.name + " = cocos2d::Label::create(\"" + "sprites/rect_curved1.png" + "\");\n";
    };
    Label.prototype.setText = function (text, fontSize) {
        this.text = text;
        this.fontSize = fontSize * this.scaleX;
        this.cppString = "auto " + this.name + " = cocos2d::Label::createWithTTF(\"" + text + "\", \"fonts/arial.ttf\", " + this.fontSize + ");\n";
    };
    Label.prototype.setLineHeight = function (lineHeight) {
        this.lineHeight = lineHeight * this.scaleX;
        this.cppString += this.name + "->setLineHeight(" + this.lineHeight + ");\n";
    };
    Label.prototype.setTextColor = function (color) {
        this.textColor = { r: color.r, g: color.g, b: color.b, a: color.a };
        this.cppString += this.name + "->setTextColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
    };
    return Label;
}(Node_1.Node));
exports.Label = Label;
