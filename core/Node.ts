import { IVec2, ISize, IColor } from "./Interfaces";
import { ICCLabel } from "./creator/interfaces/ICCLabel";
import { ICCSprite } from "./creator/interfaces/ICCSprite";
import { ICCButton } from "./creator/interfaces/ICCButton";
import { ICCNode } from "./creator/interfaces/ICCNode";

export class Node {
	public name: string;

	protected scaleX: number;
	protected scaleY: number;

	public cppString: string;
	public parent: Node;

	public position: IVec2;
	public scale: IVec2;
	public size: ISize;
	public color: IColor;
	public anchor: IVec2;
	public rotation: number;
	public opacity: number;

	public skewX: number;
	public skewY: number;

	constructor(name: string, scaleX: number, scaleY: number) {
		if (name == "this") {
			this.parent = null;
		}

		this.name = name;
		this.scaleX = scaleX;
		this.scaleY = scaleY;

		this.cppString = "";
	}

	public setPosition(position: IVec2) {
		this.position = { x: position.x, y: position.y };

		this.position.x *= this.scaleX;
		this.position.y *= this.scaleY;

		if (this.parent) {
			this.cppString += this.name + "->setPosition(" + this.position.x;
			this.cppString += " + " + this.parent.name + "->getContentSize().width / 2.0f, " + this.position.y;
			this.cppString += " + " + this.parent.name + "->getContentSize().height / 2.0f";
			this.cppString += ");\n";
		} else {
			this.cppString += this.name + "->setPosition(" + this.position.x + " + this->getParent()->getContentSize().width / 2.0f, " + this.position.y + " + this->getParent()->getContentSize().height / 2.0f);\n";
		}
	}

	public setContentSize(size: ISize) {
		this.size = { width: size.width, height: size.height };

		// Do not return anything if the values are default
		if (size.width == 0 && size.height == 0) {
			return;
		}

		this.size.width *= this.scaleX;
		this.size.height *= this.scaleY;

		this.cppString += this.name + "->setContentSize(cocos2d::Size(" + this.size.width + ", " + this.size.height + "));\n";
	}

	public setAnchorPoint(anchor: IVec2) {
		this.anchor = { x: anchor.x, y: anchor.y };

		// Do not return anything if the values are default
		if (anchor.x == 0 && anchor.y == 0) {
			return;
		}

		this.cppString += this.name + "->setAnchorPoint(cocos2d::Vec2(" + anchor.x + ", " + anchor.y + "));\n";
	}

	public setScale(scale: IVec2) {
		this.scale = { x: scale.x, y: scale.y };

		// Do not return anything if the values are default
		if (scale.x == 1 && scale.y == 1) {
			return;
		}

		this.cppString += this.name + "->setScale(" + scale.x + ", " + scale.y + ");\n";
	}

	public setColor(color: IColor) {
		this.color = { r: color.r, g: color.g, b: color.b, a: color.a };

		// Do not return anything if the values are default
		if (color.r == 255 && color.g == 255 && color.b == 255) {
			return;
		}

		this.cppString += this.name + "->setColor(cocos2d::Color3B(" + color.r + ", " + color.g + ", " + color.b + "));\n";
	}

	public setOpacity(opacity: number) {
		this.opacity = opacity;

		// Do not return anything if the values are default
		if (opacity == 255) {
			return;
		}

		this.cppString += this.name + "->setOpacity(" + opacity + ");\n";
	}

	public setRotation(rotation: number) {
		this.rotation = rotation;

		// Do not return anything if the values are default
		if (rotation == 0) {
			return;
		}

		this.cppString += this.name + "->setRotation(" + rotation + ");\n";
	}

	public setSkew(skewX: number, skewY: number) {
		this.skewX = skewX * this.scaleX;
		this.skewY = skewY * this.scaleY;

		if(this.skewX == 0 && this.skewY == 0) {
			return;
		}

		this.cppString += this.name + "->setSkewX(" + this.skewX + ");\n";
		this.cppString += this.name + "->setSkewY(" + this.skewY + ");\n";
	}

	public setSkewX(skewX: number) {
		this.skewX = skewX * this.scaleX;

		if(this.skewX == 0) {
			return;
		}

		this.cppString += this.name + "->setSkewX(" + this.skewX + ");\n";
	}

	public setSkewY(skewY: number) {
		this.skewY = skewY * this.scaleY;

		if(this.skewY == 0) {
			return;
		}

		this.cppString += this.name + "->setSkewY(" + this.skewY + ");\n";
	}

	public addChild(child: string) {
		return this.name + "->addChild(" + child + ");\n";
	}

	public Create(data: ICCNode = null) {
		if (this.name != "this") {
			this.cppString = "auto " + this.name + " = cocos2d::Node::create();\n";
		}

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

	public GetCPPString() {
		return this.cppString + "\n";
	}
}