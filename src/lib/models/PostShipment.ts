export interface PostShipment {
	id: string;
	number: string;
	type: string;
	sender: string;
	arrival: Date | null;
	status: string | null;
	dims: { x: number; y: number; z: number } | null;
	weight: number | null;
}
