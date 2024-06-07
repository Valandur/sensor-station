export interface WidgetInstance<CONFIG extends {} = {}> {
	name: string;
	type: string;
	config: CONFIG;
}

export interface WidgetConfig {}

export interface WidgetProps {
	name: string;
	prevPage?: number;
	nextPage?: number;
}
