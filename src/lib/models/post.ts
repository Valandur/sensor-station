import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const POST_WIDGET_TYPE = 'post';

export type PostWidgetInstance = WidgetInstance<PostWidgetConfig>;

export interface PostWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface PostWidgetProps extends WidgetProps {
	shipment: PostShipment;
}

// ---------
// Service
// ---------

export const POST_SERVICE_TYPE = 'post';

export type PostServiceInstance = ServiceInstance<PostServiceConfig>;

export interface PostServiceData extends ServiceData {
	shipments: PostShipment[];
}

export interface PostServiceConfig extends ServiceConfig {
	username: string;
	password: string;
}

// ---------
// Others
// ---------

export type RecursiveMap = Map<string, [string, RecursiveMap]>;

export interface PostShipment {
	id: string;
	number: string;
	type: string;
	sender: string | null;
	arrival: string | null;
	status: string | null;
	dims: { x: number; y: number; z: number } | null;
	weight: number | null;
}
