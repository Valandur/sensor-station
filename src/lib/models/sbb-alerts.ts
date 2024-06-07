import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const SBB_ALERTS_WIDGET_TYPE = 'sbb-alerts';

export type SbbAlertsWidgetInstance = WidgetInstance<SbbAlertsWidgetConfig>;

export interface SbbAlertsWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface SbbAlertsWidgetProps extends WidgetProps {
	alert: SbbAlert;
}

// ---------
// Service
// ---------

export const SBB_ALERTS_SERVICE_TYPE = 'sbb-alerts';

export type SbbAlertsServiceInstance = ServiceInstance<SbbAlertsServiceConfig>;

export interface SbbAlertsServiceData extends ServiceData {
	alerts: SbbAlert[];
}

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
