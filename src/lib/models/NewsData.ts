import type { BaseData } from './BaseData';
import type { NewsItem } from './NewsItem';

export interface NewsData extends BaseData {
	items: NewsItem[];
}
