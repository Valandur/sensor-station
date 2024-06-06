export interface ServiceData {
	ts: Date;
}

export interface ServiceConfig {
	resultCacheTime?: number;
	errorCacheTime?: number;
}

export interface ServiceInstance<CONFIG extends ServiceConfig = ServiceConfig> {
	name: string;
	type: string;
	config: CONFIG;
}
