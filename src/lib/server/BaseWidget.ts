import type { Cookies } from '@sveltejs/kit';

import { BaseLogger } from '$lib/models/BaseLogger';
import type { WidgetConfig, WidgetData, WidgetActionFailure } from '$lib/models/widget';

export interface WidgetGetDataOptions {
	url: URL;
	cookies: Cookies;
}

export interface WidgetSetDataOpations extends WidgetGetDataOptions {
	form: FormData;
}

export abstract class BaseWidget<
	ACTION extends string = string,
	CONFIG extends WidgetConfig = WidgetConfig,
	DATA extends WidgetData = WidgetData<ACTION>
> {
	public readonly name: string;
	public readonly type: string;
	public config: CONFIG;

	protected readonly logger: BaseLogger;

	public constructor(name: string, type: string, config?: CONFIG) {
		this.name = name;
		this.type = type;
		this.config = config ?? this.generateDefaultConfig();
		this.logger = new BaseLogger('WIDGET/' + name);
	}

	protected abstract generateDefaultConfig(): CONFIG;

	public abstract getData(action: ACTION, options: WidgetGetDataOptions): Promise<DATA | null>;
	public abstract setData(
		action: ACTION,
		options: WidgetSetDataOpations
	): Promise<void | WidgetActionFailure>;
}
