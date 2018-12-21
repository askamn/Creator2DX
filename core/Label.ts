import { Node } from "./Node";
import { IColor } from "./Interfaces";

export class Label extends Node {
	private text: string = null;
	private fontSize: number = null;
	private lineHeight: number = null;
	private textColor: IColor = null;

	public Create() {
		//this.cppString = "auto " + this.name + " = cocos2d::Label::create(\"" + "sprites/rect_curved1.png" + "\");\n";
	}

	public setText(text: string, fontSize: number) {
		this.text = text;
		this.fontSize = fontSize * this.scaleX;

		this.cppString = "auto " + this.name + " = cocos2d::Label::createWithTTF(\"" + text + "\", \"fonts/arial.ttf\", " + this.fontSize + ");\n";
	}

	public setLineHeight(lineHeight: number) {
		this.lineHeight = lineHeight * this.scaleX;

		this.cppString += this.name + "->setLineHeight(" + this.lineHeight + ");\n";
	}

	public setTextColor(color: IColor) {
		this.textColor = { r: color.r, g: color.g, b: color.b, a: color.a };

		this.cppString += this.name + "->setTextColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
	}
}