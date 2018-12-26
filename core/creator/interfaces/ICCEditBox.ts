import { IIDMapper } from "./IIDMapper";
import { IUUIDMapper } from "./IUUIDMapper";
import { ICCColor } from "./ICCColor";

export interface ICCEditBox {
	__type__: string;
	_name: string;
	_objFlags: number;
	node: IIDMapper;
	_enabled: boolean;
	_useOriginalSize: boolean;
	_string: string;
	_tabIndex: number;
	editingDidBegan: [];
	textChanged: [];
	editingDidEnded: [];
	editingReturn: [];
	_N$backgroundImage: IUUIDMapper;
	_N$returnType: number;
	_N$inputFlag: number;
	_N$inputMode: number;
	_N$fontSize: number;
	_N$lineHeight: number;
	_N$fontColor: ICCColor;
	_N$placeholder: string;
	_N$placeholderFontSize: number;
	_N$placeholderFontColor: ICCColor;
	_N$maxLength: number;
	_N$stayOnTop: boolean;
	_id: string;
}