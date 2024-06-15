import type { ActionFailure } from '@sveltejs/kit';

export interface ServiceType {
	name: string;
	actions: Readonly<string[]>;
}

export interface ServiceInstance {
	name: string;
	type: ServiceType;
}

export interface ServiceConfig {
	resultCacheTime?: number;
	errorCacheTime?: number;
}

export interface ServiceData {
	ts: Date;
}

export type ServiceActionFailure = ActionFailure<{
	success?: boolean;
	message: string;
}>;
