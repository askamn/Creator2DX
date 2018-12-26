import { Node } from "./Node";
import { AssetDB } from "./AssetDB";
import { ICCNode } from "./creator/interfaces/ICCNode";

export class Sprite extends Node {
	public spriteFrameUUID: string;

	public Create(data: ICCNode = null) {
		this.createVariableName();
		this.cppString = this.getVariableDeclaration() + " = cocos2d::Sprite::create(\"" + AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";

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
}