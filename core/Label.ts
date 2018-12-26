import { Node } from "./Node";
import { IColor } from "./Interfaces";
import { AssetDB } from "./AssetDB";
import { ICCLabel } from "./creator/interfaces/ICCLabel";
import { ICCColor } from "./creator/interfaces/ICCColor";
import { ICCNode } from "./creator/interfaces/ICCNode";

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

	public Create(data: ICCNode = null) {
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

	public SetProperties(cclabel: ICCLabel, color: ICCColor) {
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

	public setText(text: string, fontUUID: string, fontSize: number) {
		this.createVariableName();
		this.text = text;
		this.fontSize = fontSize * this.scaleX;

		let font = AssetDB.i().GetAsset(fontUUID);
		this.cppString = this.getVariableDeclaration() + " = cocos2d::Label::createWithTTF(\"" + text + "\", \"" + font + "\", " + this.fontSize + ");\n";
	}

	public setTextWithSystemFont(text: string, fontSize: number) {
		this.createVariableName();
		this.text = text;
		this.fontSize = fontSize * this.scaleX;

		this.cppString = this.getVariableDeclaration() + " = cocos2d::Label::createWithSystemFont(\"" + text + "\", \"arial\", " + this.fontSize + ");\n";
	}

	public setOverflow(overflow: number) {
		this.overflow = overflow;

		if(!this.overflow) {
			return;
		}

		this.cppString += this.variableName + "->setOverflow(cocos2d::Label::Overflow::" + Label.OVERFLOW_TYPE[overflow] + ");\n";
	}

	public setHorizontalAlignment(alignment: number) {
		this.horizontalAlignment = alignment;

		this.cppString += this.variableName + "->setHorizontalAlignment(cocos2d::TextHAlignment::" + Label.H_ALIGNMENTS[alignment] + ");\n";
	}

	public setVerticalAlignment(alignment: number) {
		this.verticalAlignment = alignment;

		this.cppString += this.variableName + "->setVerticalAlignment(cocos2d::TextVAlignment::" + Label.V_ALIGNMENTS[alignment] + ");\n";
	}

	public setLineHeight(lineHeight: number) {
		this.lineHeight = lineHeight * this.scaleX;

		// TODO: Find proper fix for label's lineheight
		this.cppString += "//" + this.variableName + "->setLineHeight(" + this.lineHeight + ");\n";
	}

	public setTextColor(color: ICCColor) {
		this.textColor = { r: color.r, g: color.g, b: color.b, a: color.a };

		this.cppString += this.variableName + "->setTextColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
	}
}