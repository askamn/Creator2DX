import { Node } from "./Node";

export class Sprite extends Node {
	public Create() {
		// TODO: Proper image path
		this.cppString = "auto " + this.name + " = cocos2d::Sprite::create(\"" + "sprites/rect_curved1.png" + "\");\n";
	}
}