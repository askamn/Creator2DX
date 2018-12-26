"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
const AssetDB_1 = require("./AssetDB");
class Sprite extends Node_1.Node {
    Create(data = null) {
        this.createVariableName();
        this.cppString = this.getVariableDeclaration() + " = cocos2d::Sprite::create(\"" + AssetDB_1.AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";
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
}
exports.Sprite = Sprite;
