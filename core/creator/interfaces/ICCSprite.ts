import { IIDMapper } from "./IIDMapper";
import { IUUIDMapper } from "./IUUIDMapper";
import { ICCVec2 } from "./ICCVec2";

export interface ICCSprite {
	__type__: string;
	_name: string;
	_objFlags: number;
	node: IIDMapper;
	_enabled: boolean;
	_srcBlendFactor: number;
	_dstBlendFactor: number;
	_spriteFrame: IUUIDMapper;
	_type: number; // Simple, Sliced, etc
	_sizeMode: number;
	_fillType: number
	_fillCenter: ICCVec2;
	_fillStart: number;
	_fillRange: number;
	_isTrimmedMode: boolean;
	_state: number;
	_atlas: object;
	_id: string;
}