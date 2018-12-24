import { IIDMapper } from "./IIDMapper";

export interface ICCScrollView {
	__type__: string;
	_name: string;
	_objFlags: number;
	node: IIDMapper;
	_enabled: boolean;
	horizontal: boolean;
	vertical: boolean;
	inertia: boolean;
	brake: number;
	elastic: boolean;
	bounceDuration: number;
	scrollEvents: any;
	cancelInnerEvents: boolean;
	_N$content: IIDMapper;
	content: IIDMapper;
	_N$horizontalScrollBar: any;
	_N$verticalScrollBar: any;
	_id: string;
}