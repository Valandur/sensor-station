export type RenderFunction = (ray: any) => void;
export type CanShowFunction = () => boolean;
export type OnShowFunction = () => void;
export type OnTapFunction = (pos: { x: number; y: number }) => void;

export interface Screen {
	render: RenderFunction;
	showTime?: number;
	canShow?: CanShowFunction;
	onShow?: OnShowFunction;
	onTap?: OnTapFunction;
}
