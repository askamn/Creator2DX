import { IIDMapper } from "./IIDMapper";
import { ICCColor } from "./ICCColor";
import { ICCSize } from "./ICCSize";
import { ICCVec2 } from "./ICCVec2";
import { ICCVec3 } from "./ICCVec3";
import { ICCQuat } from "./ICCQuat";

export interface ICCNode {
	__type__: string;
	_name: string;
	_objFlags: number;
	_parent: IIDMapper;
	_children: IIDMapper[];
	_active: boolean;
	_level: number;
	_components: IIDMapper[];
	_prefab: IIDMapper;
	_opacity: number;
	_color: ICCColor;
	_contentSize: ICCSize;
	_anchorPoint: ICCVec2;
	_position: ICCVec3;
	_scale: ICCVec3;
	_quat: ICCQuat;
	_skewX: number;
	_skewY: number;
	_zIndex: number;
	_is3DNode: boolean;
	groupIndex: number;
	_rotationX: number;
	_rotationY: number;
	_id: string;

	// Custom property
	__name: string;
}