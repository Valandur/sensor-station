import type { ActionFailure } from '@sveltejs/kit';

export interface WidgetInstance {
	name: string;
	type: string;
}

export interface WidgetConfig {}

export interface WidgetData<ACTION extends string = string> {
	ts: Date;
	name: string;
	type: string;
	action: ACTION;
}

export type WidgetActionFailure = ActionFailure<{
	success?: boolean;
	key: string;
	message: string;
}>;
