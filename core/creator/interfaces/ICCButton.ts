import { IIDMapper } from "./IIDMapper";
import { IUUIDMapper } from "./IUUIDMapper";
import { ICCColor } from "./ICCColor";

export interface ICCButton {
	__type__: string;
	_name: string;
	_objFlags: number;
	node: IIDMapper;
	_enabled: boolean;
	duration: number;
	zoomScale: number;
	clickEvents: any;
	_N$interactable: boolean;
	_N$enableAutoGrayEffect: boolean;
	_N$transition: number;
	transition: number;
	_N$normalColor: ICCColor;
	_N$pressedColor: ICCColor;
	pressedColor: ICCColor;
	_N$hoverColor: ICCColor;
	hoverColor: ICCColor;
	_N$disabledColor: ICCColor;
	_N$normalSprite: IUUIDMapper;
	pressedSprite: IUUIDMapper;
	_N$hoverSprite: IUUIDMapper;
	hoverSprite: IUUIDMapper;
	_N$disabledSprite: IUUIDMapper;
	_N$target: IIDMapper;
	_id: string;
}