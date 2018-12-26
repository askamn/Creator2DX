"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
const AssetDB_1 = require("./AssetDB");
exports.KeyboardReturnType = {
    DEFAULT: 0,
    DONE: 1,
    SEND: 2,
    SEARCH: 3,
    GO: 4,
    NEXT: 5
};
exports.InputMode = {
    ANY: 0,
    EMAIL_ADDRESS: 1,
    NUMERIC: 2,
    PHONE_NUMBER: 3,
    URL: 4,
    DECIMAL: 5,
    SINGLE_LINE: 6
};
exports.InputFlag = {
    PASSWORD: 0,
    SENSITIVE: 1,
    INITIAL_CAPS_WORD: 2,
    INITIAL_CAPS_SENTENCE: 3,
    INITIAL_CAPS_ALL_CHARACTERS: 4,
    DEFAULT: 5
};
class EditBox extends Node_1.Node {
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
    SetProperties(component, size) {
        this.createVariableName();
        size.width *= this.scaleX;
        size.height *= this.scaleY;
        this.cppString = this.getVariableDeclaration() + " = cocos2d::ui::EditBox::create(cocos2d::Size(" + size.width + ", " + size.height + "), cocos2d::ui::Scale9Sprite::create(\"" + AssetDB_1.AssetDB.i().GetAsset(component._N$backgroundImage.__uuid__) + "\"));\n";
        this.setText(component._string);
        this.setFontSize(component._N$fontSize);
        this.setFontColor(component._N$fontColor);
        this.setMaxLength(component._N$maxLength);
        this.setPlaceHolder(component._N$placeholder);
        this.setPlaceHolderFontSize(component._N$placeholderFontSize);
        this.setPlaceHolderFontColor(component._N$placeholderFontColor);
        this.setInputMode(component._N$inputMode);
        this.setInputFlag(component._N$inputFlag);
        this.setKeyboardReturnType(component._N$returnType);
    }
    setText(text) {
        this.text = text;
        this.cppString += this.variableName + "->setText( \"" + this.text + "\" );\n";
    }
    setFontSize(fontSize) {
        this.fontSize = fontSize * this.scaleX;
        this.cppString += this.variableName + "->setFontSize( " + this.fontSize + " );\n";
    }
    setFontColor(color) {
        this.textColor = { r: color.r, g: color.g, b: color.b, a: color.a };
        this.cppString += this.variableName + "->setFontColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
    }
    setMaxLength(maxLength) {
        this.maxLength = maxLength;
        this.cppString += this.variableName + "->setMaxLength(" + this.maxLength + ");\n";
    }
    setPlaceHolder(text) {
        this.placeHolder = text;
        this.cppString += this.variableName + "->setPlaceHolder(\"" + this.placeHolder + "\");\n";
    }
    setPlaceHolderFontSize(fontSize) {
        this.placeHolderFontSize = fontSize * this.scaleX;
        this.cppString += this.variableName + "->setPlaceholderFontSize(" + this.placeHolderFontSize + ");\n";
    }
    setPlaceHolderFontColor(color) {
        this.placeHolderFontColor = { r: color.r, g: color.g, b: color.b, a: color.a };
        this.cppString += this.variableName + "->setPlaceholderFontColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
    }
    setInputMode(inputMode) {
        this.inputMode = inputMode;
        let mode = Object.keys(exports.InputMode).find(key => exports.InputMode[key] == inputMode);
        this.cppString += this.variableName + "->setInputMode(cocos2d::ui::EditBox::InputMode::" + mode + ");\n";
    }
    setInputFlag(inputFlag) {
        if (inputFlag == exports.InputFlag.DEFAULT) {
            return;
        }
        this.inputFlag = inputFlag;
        let flag = Object.keys(exports.InputFlag).find(key => exports.InputFlag[key] == inputFlag);
        this.cppString += this.variableName + "->setInputFlag(cocos2d::ui::EditBox::InputFlag::" + flag + ");\n";
    }
    setKeyboardReturnType(returnType) {
        this.keyboardReturnType = returnType;
        let type = Object.keys(exports.KeyboardReturnType).find(key => exports.KeyboardReturnType[key] == returnType);
        this.cppString += this.variableName + "->setReturnType(cocos2d::ui::EditBox::KeyboardReturnType::" + type + ");\n";
    }
    setPosition(position) {
        this.position = { x: position.x, y: position.y };
        position.x *= this.scaleX;
        position.y *= this.scaleY;
        if (this.parent) {
            this.cppString += this.variableName + "->setPosition(cocos2d::Vec2(" + position.x;
            this.cppString += " + " + this.parent.variableName + "->getContentSize().width / 2.0f, " + position.y;
            this.cppString += " + " + this.parent.variableName + "->getContentSize().height / 2.0f";
            this.cppString += "));\n";
        }
        else {
            this.cppString += this.variableName + "->setPosition(cocos2d::Vec2(" + position.x + " + this->getParent()->getContentSize().width / 2.0f, " + position.y + " + this->getParent()->getContentSize().height / 2.0f));\n";
        }
    }
}
exports.EditBox = EditBox;
