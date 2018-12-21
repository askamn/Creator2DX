
import { Node } from "./Node";
import { AssetDB } from "./AssetDB";
import { IVec2 } from "./Interfaces";

export class Button extends Node {
	public spriteFrameUUID: string;

	public Create() {
		// TODO: Proper image path
		this.cppString = "auto " + this.name + " = cocos2d::ui::Button::create(\"" + AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";
		this.cppString += this.name + "->setScale9Enabled(true);\n";
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