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
