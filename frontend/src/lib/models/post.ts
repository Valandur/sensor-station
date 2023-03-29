import { gql } from '@urql/svelte';

export interface Post {
	shipments: PostShipment[] | null;
}

export interface PostShipment {
	id: string;
	type: string;
	arrival: string;
	sender: string;
	dims: {
		x: number;
		y: number;
		z: number;
	};
	weight: number;
}

export interface GetPostData {
	post: Post;
}
export const GET_POST = gql`
	query GetPost {
		post {
			shipments {
				id
				type
				arrival
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
