import type { ActionFailure } from '@sveltejs/kit';

export interface ServiceType {
	name: string;
	actions: Readonly<string[]>;
}

export interface ServiceInstance {
	name: string;
	type: ServiceType;
}

export interface ServiceComponentProps {
	name: string;
	action: string;
	isEmbedded: boolean;
}

export interface ServiceConfig {
	resultCacheTime?: number;
	errorCacheTime?: number;
}

export type ServiceActionFailure = ActionFailure<{
	success?: boolean;
	message: string;
}>;
