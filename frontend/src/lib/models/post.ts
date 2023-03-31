import { gql } from '@urql/svelte';

export interface Post {
	shipments: PostShipment[] | null;
}

export interface PostShipment {
	number: string;
	type: string;
	arrival: string | null;
	status: string | null;
	sender: string;
	dims: { x: number; y: number; z: number } | null;
	weight: number | null;
}

export interface GetPostData {
	post: Post;
}
export const GET_POST = gql`
	query GetPost {
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
