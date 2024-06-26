import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const SBB_ALERTS_SERVICE_TYPE = 'sbb-alerts';
export const SBB_ALERTS_SERVICE_ACTIONS = ['main', 'preview', 'config'] as const;

export type SbbAlertsServiceAction = (typeof SBB_ALERTS_SERVICE_ACTIONS)[number];

export interface SbbAlertsServiceMainData extends ServiceData {
	type: 'data';
	prevPage: number;
	nextPage: number;
	alert: SbbAlert;
}
export interface SbbAlertsServiceConfigData extends ServiceData {
	type: 'config';
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
