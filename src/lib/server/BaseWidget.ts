import type { ActionFailure } from '@sveltejs/kit';

import { BaseLogger } from '$lib/models/BaseLogger';
import type { WidgetConfig, WidgetProps } from '$lib/models/widget';

import services from './services';

export type WidgetValidateFailure = ActionFailure<{ message: string }>;

export abstract class BaseWidget<
	CONFIG extends WidgetConfig = WidgetConfig,
	PROPS extends WidgetProps = WidgetProps
> {
	public abstract readonly type: string;
	protected readonly logger: BaseLogger;
	protected readonly services = services;

	protected constructor(name: string) {
		this.logger = new BaseLogger(name);
	}

	public abstract props(config: CONFIG, page: number): Promise<PROPS | null>;
	public abstract validate(config: FormData): Promise<CONFIG | WidgetValidateFailure>;
}
