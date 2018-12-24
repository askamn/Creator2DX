import { Node } from "./Node";
import { IColor } from "./Interfaces";
import { AssetDB } from "./AssetDB";
import { ICCLabel } from "./creator/interfaces/ICCLabel";
import { ICCColor } from "./creator/interfaces/ICCColor";

export class Label extends Node {
	// Shamelessly copied from cocos-creator-cocos-2dx project
	public static H_ALIGNMENTS = ['LEFT', 'CENTER', 'RIGHT'];
	public static V_ALIGNMENTS = ['TOP', 'CENTER', 'BOTTOM'];
	public static OVERFLOW_TYPE = ['NONE', 'CLAMP', 'SHRINK', 'RESIZEHEIGHT'];

	private text: string = null;
	private fontSize: number = null;
	private lineHeight: number = null;
	private textColor: IColor = null;
	private horizontalAlignment: number;
	private verticalAlignment: number;
	private overflow: number;

	public CreateWithData(cclabel: ICCLabel, color: ICCColor) {
		if (cclabel._isSystemFontUsed) {
			this.setTextWithSystemFont(cclabel._string, cclabel._fontSize);
		} else {
			this.setText(cclabel._string, cclabel._N$file.__uuid__, cclabel._fontSize);
		}

		this.setLineHeight(cclabel._lineHeight);
		this.setTextColor(color);
		this.setHorizontalAlignment(cclabel._N$horizontalAlign);
		this.setVerticalAlignment(cclabel._N$verticalAlign);
		this.setOverflow(cclabel._N$overflow);
		//this.cppString = "auto " + this.name + " = cocos2d::Label::create(\"" + "sprites/rect_curved1.png" + "\");\n";
	}

	public setTextWithSystemFont(text: string, fontSize: number) {
		this.text = text;
		this.fontSize = fontSize * this.scaleX;

		this.cppString = "auto " + this.name + " = cocos2d::Label::createWithSystemFont(\"" + text + "\", \"arial\", " + this.fontSize + ");\n";
	}

	public setOverflow(overflow: number) {
		this.overflow = overflow;

		if(!this.overflow) {
			return;
		}

		this.cppString += this.name + "->setOverflow(cocos2d::Label::Overflow::" + Label.OVERFLOW_TYPE[overflow] + ");\n";
	}

	public setHorizontalAlignment(alignment: number) {
		this.horizontalAlignment = alignment;

		this.cppString += this.name + "->setHorizontalAlignment(cocos2d::TextHAlignment::" + Label.H_ALIGNMENTS[alignment] + ");\n";
	}

	public setVerticalAlignment(alignment: number) {
		this.verticalAlignment = alignment;

		this.cppString += this.name + "->setVerticalAlignment(cocos2d::TextVAlignment::" + Label.V_ALIGNMENTS[alignment] + ");\n";
	}

	public setText(text: string, fontUUID: string, fontSize: number) {
		this.text = text;
		this.fontSize = fontSize * this.scaleX;

		let font = AssetDB.i().GetAsset(fontUUID);
		this.cppString = "auto " + this.name + " = cocos2d::Label::createWithTTF(\"" + text + "\", \"" + font + "\", " + this.fontSize + ");\n";
	}

	public setLineHeight(lineHeight: number) {
		this.lineHeight = lineHeight * this.scaleX;

		this.cppString += this.name + "->setLineHeight(" + this.lineHeight + ");\n";
	}

	public setTextColor(color: ICCColor) {
		this.textColor = { r: color.r, g: color.g, b: color.b, a: color.a };

		this.cppString += this.name + "->setTextColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
	}
}