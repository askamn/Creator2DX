import { IIDMapper } from "./IIDMapper";
import { IUUIDMapper } from "./IUUIDMapper";

export interface ICCLabel {
	__type__: string;
	_name: string;
	_objFlags: number;
	node: IIDMapper;
	_enabled: boolean;
	_srcBlendFactor: number;
	_dstBlendFactor: number;
	_useOriginalSize: boolean;
	_string: string;
	_N$string: string;
	_fontSize: number;
	_lineHeight: number;
	_enableWrapText: boolean;
	_N$file: IUUIDMapper;
	_isSystemFontUsed: boolean;
	_spacingX: number;

	_N$horizontalAlign: number;
	_N$verticalAlign: number;
	_N$fontFamily: string;
	_N$overflow: number;
	_id: string;
}