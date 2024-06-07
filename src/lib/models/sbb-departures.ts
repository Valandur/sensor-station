import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const SBB_DEPARTURES_WIDGET_TYPE = 'sbb-departures';

export type SbbDeparturesWidgetInstance = WidgetInstance<SbbDeparturesWidgetConfig>;

export interface SbbDeparturesWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface SbbDeparturesWidgetProps extends WidgetProps {
	departures: SbbDeparture[];
}

// ---------
// Service
// ---------

export const SBB_DEPARTURES_SERVICE_TYPE = 'sbb-departures';

export type SbbDeparturesServiceInstance = ServiceInstance<SbbDeparturesServiceConfig>;

export interface SbbDeparturesServiceData extends ServiceData {
	departures: SbbDeparture[];
}

export interface SbbDeparturesServiceConfig extends ServiceConfig {
	apiKey: string;
	stopPoint: string;
}

// ---------
// Others
// ---------

export interface SbbDeparture {
	scheduled: Date;
	estimated: Date | null;
	delay: number;
	destination: string;
	lineName: string;
	type: string | null;
}
