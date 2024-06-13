import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetData } from './widget';

// ---------
// Widgets
// ---------

export const SBB_ALERTS_WIDGET_TYPE = 'sbb-alerts';
export const SBB_ALERTS_WIDGET_ACTIONS = ['', 'config'] as const;

export type SbbAlertsWidgetAction = (typeof SBB_ALERTS_WIDGET_ACTIONS)[number];

export interface SbbAlertsWidgetMainData extends WidgetData<SbbAlertsWidgetAction> {
	action: '';
	alert: SbbAlert;
}
export interface SbbAlertsWidgetConfigData extends WidgetData<SbbAlertsWidgetAction> {
	action: 'config';
	config: SbbAlertsWidgetConfig;
	services: ServiceInstance[];
}
export type SbbAlertsWidgetData = SbbAlertsWidgetMainData | SbbAlertsWidgetConfigData;

export interface SbbAlertsWidgetConfig extends WidgetConfig {
	service: string;
}

// ---------
// Service
// ---------

export const SBB_ALERTS_SERVICE_TYPE = 'sbb-alerts';
export const SBB_ALERTS_SERVICE_ACTIONS = ['', 'config'] as const;

export type SbbAlertsServiceAction = (typeof SBB_ALERTS_SERVICE_ACTIONS)[number];

export interface SbbAlertsServiceMainData extends ServiceData<SbbAlertsServiceAction> {
	action: '';
	alerts: SbbAlert[];
}
export interface SbbAlertsServiceConfigData extends ServiceData<SbbAlertsServiceAction> {
	action: 'config';
	config: SbbAlertsServiceConfig;
}
export type SbbAlertsServiceData = SbbAlertsServiceMainData | SbbAlertsServiceConfigData;

export interface SbbAlertsServiceConfig extends ServiceConfig {
	apiKey: string;
	words: string[];
}

// ---------
// Others
// ---------

export interface SbbAlert {
	start: Date;
	end: Date;
	summary: string;
	reason: string | undefined;
	description: string | undefined;
	consequence: string | undefined;
	duration: string | undefined;
	recommendation: string | undefined;
}

export interface SituationElement {
	ValidityPeriod: {
		StartTime: string[];
		EndTime: string[];
	}[];
	Planned?: string[];
	PublishingActions: {
		PublishingAction: {
			PassengerInformationAction: {
				TextualContent: {
					TextualContentSize: string[];
					SummaryContent: {
						SummaryText: Text[];
					}[];
					ReasonContent?: {
						ReasonText: Text[];
					}[];
					DescriptionContent?: {
						DescriptionText: Text[];
					}[];
					ConsequenceContent?: {
						ConsequenceText: Text[];
					}[];
					DurationContent?: {
						DurationText: Text[];
					}[];
					RecommendationContent?: {
						RecommendationText: Text[];
					}[];
				}[];
			}[];
		}[];
	}[];
}

export interface Text {
	$: {
		'xml:lang': string;
	};
	_: string;
}
