import { Node } from "./Node";
import { AssetDB } from "./AssetDB";

export class Sprite extends Node {
	public spriteFrameUUID: string;

	public Create() {
		this.cppString = "auto " + this.name + " = cocos2d::Sprite::create(\"" + AssetDB.i().GetAsset(this.spriteFrameUUID) + "\");\n";
	}
}