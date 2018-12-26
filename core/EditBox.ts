import { Node } from "./Node";
import { ICCNode } from "./creator/interfaces/ICCNode";
import { ICCEditBox } from "./creator/interfaces/ICCEditBox";
import { AssetDB } from "./AssetDB";
import { IColor, IVec2 } from "./Interfaces";
import { ICCColor } from "./creator/interfaces/ICCColor";
import { ICCSize } from "./creator/interfaces/ICCSize";

export const KeyboardReturnType = {
	DEFAULT: 0,
	DONE: 1,
	SEND: 2,
	SEARCH: 3,
	GO: 4,
	NEXT: 5
};

export const InputMode = {
	ANY: 0,
	EMAIL_ADDRESS: 1,
	NUMERIC: 2,
	PHONE_NUMBER: 3,
	URL: 4,
	DECIMAL: 5,
	SINGLE_LINE: 6
};

export const InputFlag = {
	PASSWORD: 0,
	SENSITIVE: 1,
	INITIAL_CAPS_WORD: 2,
	INITIAL_CAPS_SENTENCE: 3,
	INITIAL_CAPS_ALL_CHARACTERS: 4,
	DEFAULT: 5
};

export class EditBox extends Node {
	private fontSize: number; 
	private textColor: IColor;
	private maxLength: number;
	private placeHolder: string;
	private placeHolderFontSize: number;
	private placeHolderFontColor: IColor;
	private inputMode: number;
	private inputFlag: number;
	private keyboardReturnType: number;
	private text: string;

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

	public SetProperties(component: ICCEditBox, size: ICCSize) {
		this.createVariableName();

		size.width *= this.scaleX;
		size.height *= this.scaleY;
		
		this.cppString = this.getVariableDeclaration() + " = cocos2d::ui::EditBox::create(cocos2d::Size(" + size.width + ", " + size.height + "), cocos2d::ui::Scale9Sprite::create(\"" + AssetDB.i().GetAsset( component._N$backgroundImage.__uuid__ ) + "\"));\n";
		
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

	public setText(text: string) {
		this.text = text;
		this.cppString += this.variableName + "->setText( \"" + this.text + "\" );\n";
	}

	public setFontSize(fontSize: number) {
		this.fontSize = fontSize * this.scaleX;
		this.cppString += this.variableName + "->setFontSize( " + this.fontSize +" );\n";
	}

	public setFontColor(color: ICCColor) {
		this.textColor = { r: color.r, g: color.g, b: color.b, a: color.a };
		this.cppString += this.variableName + "->setFontColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
	}

	public setMaxLength(maxLength: number) {
		this.maxLength = maxLength;
		this.cppString += this.variableName + "->setMaxLength(" + this.maxLength + ");\n";
	}

	public setPlaceHolder(text: string) {
		this.placeHolder = text;
		this.cppString += this.variableName + "->setPlaceHolder(\"" + this.placeHolder + "\");\n";
	}

	public setPlaceHolderFontSize(fontSize: number) {
		this.placeHolderFontSize = fontSize * this.scaleX;
		this.cppString += this.variableName + "->setPlaceholderFontSize(" + this.placeHolderFontSize + ");\n";
	}

	public setPlaceHolderFontColor(color: ICCColor) {
		this.placeHolderFontColor ={ r: color.r, g: color.g, b: color.b, a: color.a };
		this.cppString += this.variableName + "->setPlaceholderFontColor(cocos2d::Color4B(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + "));\n";
	}

	public setInputMode(inputMode: number) {
		this.inputMode = inputMode;
		let mode = Object.keys(InputMode).find(key => InputMode[key] == inputMode);
		this.cppString += this.variableName + "->setInputMode(cocos2d::ui::EditBox::InputMode::" + mode + ");\n";
	}

	public setInputFlag(inputFlag: number) {
		if(inputFlag == InputFlag.DEFAULT) {
			return;
		}

		this.inputFlag = inputFlag;
		let flag = Object.keys(InputFlag).find(key => InputFlag[key] == inputFlag);
		this.cppString += this.variableName + "->setInputFlag(cocos2d::ui::EditBox::InputFlag::" + flag + ");\n";
	}

	public setKeyboardReturnType(returnType: number) {
		this.keyboardReturnType = returnType;
		let type = Object.keys(KeyboardReturnType).find(key => KeyboardReturnType[key] == returnType);
		this.cppString += this.variableName + "->setReturnType(cocos2d::ui::EditBox::KeyboardReturnType::" + type + ");\n";
	}

	public setPosition(position: IVec2) {
		this.position = { x: position.x, y: position.y };

		position.x *= this.scaleX;
		position.y *= this.scaleY;

		if (this.parent) {
			this.cppString += this.variableName + "->setPosition(cocos2d::Vec2(" + position.x;
			this.cppString += " + " + this.parent.variableName + "->getContentSize().width / 2.0f, " + position.y;
			this.cppString += " + " + this.parent.variableName + "->getContentSize().height / 2.0f";
			this.cppString += "));\n";
		} else {
			this.cppString += this.variableName + "->setPosition(cocos2d::Vec2(" + position.x + " + this->getParent()->getContentSize().width / 2.0f, " + position.y + " + this->getParent()->getContentSize().height / 2.0f));\n";
		}
	}
}