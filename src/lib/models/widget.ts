export interface WidgetInstance<CONFIG extends {} = {}> {
	name: string;
	type: string;
	config: CONFIG;
}

export interface WidgetConfig {}

export interface WidgetProps {
	prevPage?: number;
	nextPage?: number;
}
