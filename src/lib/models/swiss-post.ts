import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const SWISS_POST_SERVICE_TYPE = 'swiss-post';
export const SWISS_POST_SERVICE_ACTIONS = ['main', 'config'] as const;

export type SwissPostServiceAction = (typeof SWISS_POST_SERVICE_ACTIONS)[number];

export interface SwissPostServiceMainData extends ServiceData {
	type: 'data';
	prevPage: number;
	nextPage: number;
	shipment: Shipment;
}
export interface SwissPostServiceConfigData extends ServiceData {
	type: 'config';
	config: SwissPostServiceConfig;
}

export type SwissPostServiceData = SwissPostServiceMainData | SwissPostServiceConfigData;

export interface SwissPostServiceConfig extends ServiceConfig {
	username: string;
	password: string;
}

// ---------
// Others
// ---------

export type RecursiveMap = Map<string, [string, RecursiveMap]>;

export interface Shipment {
	id: string;
	number: string;
	type: string;
	sender: string | null;
	arrival: string | null;
	status: string;
	dims: { x: number; y: number; z: number } | null;
	weight: number | null;
	events: ShipmentEvent[];
}

export interface ShipmentEvent {
	ts: Date;
	event: string;
}

export interface RawShipment {
	shipment: RawShipmentInner;
	origins: string[];
}

export interface RawShipmentInner {
	frankingLicense: string;
	thirdPartnerDelivery: boolean;
	senderDeliveryOfficeZip: any;
	expectedDeliveryDistrict: any;
	identity: string;
	kdpId: number;
	shipmentInfoCreationDateTime: string;
	creationDateTime: string;
	sendingDateTime: string;
	lastEventDateTime: string;
	product: string;
	internationalProduct: any;
	additionalServices: AdditionalService[];
	status: string;
	additionalStatus: string;
	debitorDescription: string;
	sender: any;
	physicalProperties: PhysicalProperties;
	imageReference: string;
	houseKey: number;
	globalStatus: string;
	calculatedDeliveryDate: string;
	deliveryDate: any;
	attemptedDeliveryDate: string;
	postboxDeliveryStatus: string;
	postOfficeBox: boolean;
	elwepEvent: any;
	eleEvent: any;
	owner: boolean;
	frankingLicenseOwner: boolean;
	signature: Signature;
	internationalBarcode: any;
	amountBln: number;
	avis: Avis;
	internationalImport: boolean;
	deliveryTimeWindow: any;
	deliveryTimeInterval: any;
	originalAddressee: OriginalAddressee;
	blnSendingId: any;
	blnStateId: number;
	commentId: number;
	ezagValutaDate: any;
	esrRefNo: any;
	account: any;
	blnBetrag: number;
	addressee: Addressee;
	addresseeType: string;
	deliveryPostOfficeZip: string;
	availableSingleSettings: any[];
	deliveryRange: any;
	briefFormat: any;
	signatureRequired: boolean;
	investigationFlag: boolean;
	internationalExport: boolean;
	recipientCountry: any;
	senderCountry: any;
	customsShipment: boolean;
	customsPaid: boolean;
	returnCount: number;
	events: any[];
	thirdPartyPartner: string;
	type: string;
	source: string;
	closed: boolean;
	sorted: boolean;
	tnt: boolean;
	fedEx: boolean;
	returned: boolean;
	displayedAvisCode: string;
	letterCheckId: boolean;
	blackListed: boolean;
	electronicApprovalAllowed: boolean;
	esrnumber: any;
	shipmentNumber: string;
	shipmentId: string;
	formattedShipmentNumber: string;
	bu: boolean;
	expectedDeliveryZip: any;
	delivered: boolean;
	coverAid: boolean;
	nameToBeShown: boolean;
	reported: boolean;
	identifier: string;
}

export interface AdditionalService {
	priority: number;
	value: string[];
}

export interface PhysicalProperties {
	dimension1: number;
	dimension2: number;
	dimension3: number;
	weight: number;
}

export interface Signature {
	imageId: any;
	imageDate: any;
	name: any;
}

export interface Avis {
	deliveryPostOfficeZip: string;
	deadline: string;
	date: string;
	maxDeadline: string;
	startPickupDate: any;
	arrivalPostOfficeZip: string;
	isMyPost24: boolean;
	isMyPost24Version2: boolean;
}

export interface OriginalAddressee {
	name1: string;
	name2: string;
	name3: any;
	street: string;
	number: any;
	zip: string;
	city: string;
	streetAndNumber: string;
}

export interface Addressee {
	name1: string;
	name2: string;
	name3: any;
	street: string;
	number: string;
	zip: string;
	city: string;
	streetAndNumber: string;
}

export interface RawShipmentEvent {
	shipmentNumber: string;
	eventCode: string;
	timestamp: string;
	zip: string;
	city: string;
	country: string;
	subEventId: any;
	subEventAdditionalInfo: any;
	eventCodeType: string;
	externalMetadata: Record<string, unknown>;
	flags: any[];
	remarks: any;
	imageId: string;
	signatureId: any;
	signatureSigner: any;
	signatureDate: any;
	recipientIdentification: any;
}

export const GLOBAL_STATUS: Record<string, string> = {
	CANCELLED: 'Annulliert',
	ARCHIVED: 'Archiviert',
	MISSED_DELIVERY: 'Verpasst',
	RETURNED: 'Rücksendung',
	UNKNOWN: 'Unbekannt',
	DELIVERED: 'Geliefert',
	TO_BE_DELIVERED: 'Unterwegs',
	REPORTED: 'Angemeldet'
};
