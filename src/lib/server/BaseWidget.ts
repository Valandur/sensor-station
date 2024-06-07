import type { ActionFailure } from '@sveltejs/kit';

import { BaseLogger } from '$lib/models/BaseLogger';
import type { WidgetConfig, WidgetInstance, WidgetProps } from '$lib/models/widget';

import services from './services';

export type WidgetValidateFailure = ActionFailure<{ message: string }>;

export abstract class BaseWidget<
	CONFIG extends WidgetConfig = WidgetConfig,
	PROPS extends WidgetProps = WidgetProps,
	ACTION extends WidgetProps = PROPS
> {
	public abstract readonly type: string;
	protected readonly logger: BaseLogger;
	protected readonly services = services;

	protected constructor(name: string) {
		this.logger = new BaseLogger(name);
	}

	public abstract props(instance: WidgetInstance<CONFIG>, page: number): Promise<PROPS | null>;

	public abstract validate(
		instance: WidgetInstance<CONFIG>,
		config: FormData
	): Promise<CONFIG | WidgetValidateFailure>;

	public async action(instance: WidgetInstance<CONFIG>, action: string): Promise<ACTION | null> {
		return null;
	}
}
