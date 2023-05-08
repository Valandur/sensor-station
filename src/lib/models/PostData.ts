import type { BaseData } from './BaseData';
import type { PostShipment } from './PostShipment';

export interface PostData extends BaseData {
	shipments: PostShipment[];
}
