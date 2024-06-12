import type { ActionFailure } from '@sveltejs/kit';

export interface ServiceInstance {
	name: string;
	type: string;
}

export interface ServiceConfig {
	resultCacheTime?: number;
	errorCacheTime?: number;
}

export interface ServiceData<ACTION extends string = string> {
	ts: Date;
	name: string;
	type: string;
	action: ACTION;
}

export type ServiceActionFailure = ActionFailure<{
	success?: boolean;
	key: string;
	message: string;
}>;
