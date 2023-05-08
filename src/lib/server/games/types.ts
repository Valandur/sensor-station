export interface RawGame {
	title: string;
	keyImages: {
		type: string;
		url: string;
	}[];
	promotions: {
		promotionalOffers: RawPromotionalOffer[];
		upcomingPromotionalOffers: RawPromotionalOffer[];
	};
}

export interface RawPromotionalOffer {
	promotionalOffers: {
		startDate: string;
		endDate: string;
		discountSetting: {
			discountType: string;
			discountPercentage: number;
		};
	}[];
}
