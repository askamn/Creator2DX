"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
const AssetDB_1 = require("./AssetDB");
class Button extends Node_1.Node {
    Create(data = null) {
        this.createVariableName();
        this.cppString = this.getVariableDeclaration() + " = cocos2d::ui::Button::create(\"" + AssetDB_1.AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";
        this.cppString += this.variableName + "->setScale9Enabled(true);\n";
        // Attach event listeners
        this.cppString += this.variableName + `->addTouchEventListener([&](Ref* sender, cocos2d::ui::Widget::TouchEventType type){
			switch (type)
			{
				case cocos2d::ui::Widget::TouchEventType::BEGAN:
					// Do something
					break;
				case cocos2d::ui::Widget::TouchEventType::ENDED:
					// Do something
					break;
				default:
					// Do something
					break;
			}
		});\n`;
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
    CreateWithData(ccbutton, label) {
        this.variableName = "m_" + this.name;
        this.cppString = this.variableName + " = cocos2d::ui::Button::create(\"" + AssetDB_1.AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";
        this.cppString += this.variableName + "->setScale9Enabled(true);\n";
        this.setTextLabel(label.name);
    }
    setTextLabel(textLabelName) {
        this.cppString += this.variableName + "->setTitleLabel(" + textLabelName + ");\n";
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
exports.Button = Button;
