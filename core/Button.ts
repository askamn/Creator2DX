
import { Node } from "./Node";
import { AssetDB } from "./AssetDB";
import { IVec2 } from "./Interfaces";
import { ICCButton } from "./creator/interfaces/ICCButton";
import { Label } from "./Label";
import { ICCNode } from "./creator/interfaces/ICCNode";

export class Button extends Node {
	public spriteFrameUUID: string;

	public Create(data: ICCNode = null) {
		this.cppString = "auto " + this.name + " = cocos2d::ui::Button::create(\"" + AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";
		this.cppString += this.name + "->setScale9Enabled(true);\n";

		// Attach event listeners
		this.cppString += this.name + `->addTouchEventListener([&](Ref* sender, cocos2d::ui::Widget::TouchEventType type){
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
		});`

		if(data) {
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

	public CreateWithData(ccbutton: ICCButton, label: Label) {
		// TODO: Proper image path
		this.cppString = "auto " + this.name + " = cocos2d::ui::Button::create(\"" + AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";
		this.cppString += this.name + "->setScale9Enabled(true);\n";

		this.setTextLabel(label.name);
	}

	public setTextLabel(textLabelName: string) {
		this.cppString += this.name + "->setTitleLabel(" + textLabelName + ");\n";
	}

	public setPosition(position: IVec2) {
		this.position = { x: position.x, y: position.y };

		position.x *= this.scaleX;
		position.y *= this.scaleY;

		if (this.parent) {
			this.cppString += this.name + "->setPosition(cocos2d::Vec2(" + position.x;
			this.cppString += " + " + this.parent.name + "->getContentSize().width / 2.0f, " + position.y;
			this.cppString += " + " + this.parent.name + "->getContentSize().height / 2.0f";
			this.cppString += "));\n";
		} else {
			this.cppString += this.name + "->setPosition(cocos2d::Vec2(" + position.x + " + this->getParent()->getContentSize().width / 2.0f, " + position.y + " + this->getParent()->getContentSize().height / 2.0f));\n";
		}
	}
}