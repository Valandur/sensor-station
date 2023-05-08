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
