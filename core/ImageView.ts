import { Node } from "./Node";
import { IVec2 } from "./Interfaces";
import { AssetDB } from "./AssetDB";

export class ImageView extends Node {
	public spriteFrameUUID: string;

	public Create() {
		this.cppString = "auto " + this.name + " = cocos2d::ui::ImageView::create(\"" + AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";
		this.cppString += this.name + "->setScale9Enabled(true);\n";
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