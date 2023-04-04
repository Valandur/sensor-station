import { gql } from '@urql/svelte';

export interface PostShipment {
	number: string;
	type: string;
	arrival: string | null;
	status: string | null;
	sender: string;
	dims: { x: number; y: number; z: number } | null;
	weight: number | null;
}

export interface PostShipments {
	post: {
		shipments: PostShipment[] | null;
	};
}
export const POST_SHIPMENTS = gql`
	fragment PostShipments on Query {
		post {
			shipments {
				number
				type
				arrival
				status
				sender
				dims {
					x
					y
					z
				}
				weight
			}
		}
	}
`;
