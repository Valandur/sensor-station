export type RenderFunction = (ray: any) => void;
export type CanShowFunction = () => boolean;
export type OnTapFunction = (pos: { x: number; y: number }) => void;

export interface Screen {
	render: RenderFunction;
	showTime?: number;
	canShow?: CanShowFunction;
	onTap?: OnTapFunction;
}
