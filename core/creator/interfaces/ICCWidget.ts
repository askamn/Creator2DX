import { IIDMapper } from "./IIDMapper";

export interface ICCWidget {
	__type__: string;
	_name: string;
	_objFlags: number;
	node: IIDMapper;
	_enabled: boolean;
	alignMode: number;
	_target: object;
	_alignFlags: number;
	_left: number;
	_right: number;
	_top: number;
	_bottom: number;
	_verticalCenter: number;
	_horizontalCenter: number;
	_isAbsLeft: boolean;
	_isAbsRight: boolean;
	_isAbsTop: boolean;
	_isAbsBottom: boolean;
	_isAbsHorizontalCenter: boolean;
	_isAbsVerticalCenter: boolean;
	_originalWidth: number;
	_originalHeight: number;
	_id: string;
}