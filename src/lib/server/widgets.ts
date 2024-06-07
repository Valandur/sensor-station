import { dirname } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { error, fail } from '@sveltejs/kit';

import type { WidgetInstance, WidgetProps } from '$lib/models/widget';
import type { BaseData } from '$lib/models/BaseData';
import type { BaseConfig } from '$lib/models/BaseConfig';

import type { BaseWidget } from './BaseWidget';
import { BaseService } from './BaseService';
import calendar from './calendar/widget';
import weather from './weather/widget';
import epicGames from './epic-games/widget';
import prusa from './prusa/widget';
import tuya from './tuya/widget';
import srf from './srf/widget';

type WidgetMap = { [key: string]: BaseWidget };

const WIDGETS_PATH = 'data/widgets.json';
const WIDGET_MAP: WidgetMap = {
	[calendar.type]: calendar,
	[weather.type]: weather,
	[epicGames.type]: epicGames,
	[prusa.type]: prusa,
	[tuya.type]: tuya,
	[srf.type]: srf
};

class WidgetService extends BaseService {
	public readonly type: string = 'widgets';

	private loaded: boolean = false;
	private widgets: WidgetInstance[] = [];
	private widgetMap: Map<string, WidgetInstance> = new Map();

	public constructor() {
		super('WIDGETS');
	}

	public override async get(): Promise<BaseData> {
		await this.load();
		return { ts: new Date() };
	}

	public override validate(config: FormData): Promise<BaseConfig> {
		throw new Error('Not supported');
	}

	public async props(widget: WidgetInstance, page: number): Promise<WidgetProps | null> {
		const w = WIDGET_MAP[widget.type];
		if (!w) {
			error(400, { key: 'widgets.invalid', message: `Invalid widget type ${widget.type}` });
		}

		const props = await w.props(widget.config, page);
		return props;
	}

	public types() {
		return Object.keys(WIDGET_MAP);
	}

	public all() {
		return this.widgets;
	}

	public byName(name: string) {
		return this.widgetMap.get(name);
	}

	public async add(name: string, type: string) {
		if (this.widgetMap.has(name)) {
			throw fail(400, { name: 'duplicate' });
		}

		const instance: WidgetInstance = { name, type, config: {} };
		this.widgetMap.set(name, instance);
		this.widgets.push(instance);

		await this.save();
	}

	public async set(widget: WidgetInstance, configData: FormData) {
		const srv = WIDGET_MAP[widget.type];
		widget.config = await srv.validate(configData);

		await this.save();

		return widget;
	}

	public async remove(name: string) {
		this.widgetMap.delete(name);
		this.widgets = this.widgets.filter((w) => w.name !== name);
	}

	private async load() {
		if (this.loaded) {
			return;
		}

		this.logger.debug('Loading...');
		const startTime = process.hrtime.bigint();

		await mkdir(dirname(WIDGETS_PATH), { recursive: true });
		const rawWidgets = JSON.parse(await readFile(WIDGETS_PATH, 'utf-8').catch(() => '[]'));

		const newWidgetMap: Map<string, WidgetInstance> = new Map();
		for (const rawWidget of rawWidgets) {
			newWidgetMap.set(rawWidget.name, {
				name: rawWidget.name,
				type: rawWidget.type,
				config: rawWidget.config
			});
		}

		this.widgetMap = newWidgetMap;
		this.widgets = [...newWidgetMap.values()];
		this.loaded = true;

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Loaded', rawWidgets.length, 'widgets', diffTime, 'ms');
	}

	private async save() {
		this.logger.debug('Saving...');
		const startTime = process.hrtime.bigint();

		await writeFile(WIDGETS_PATH, JSON.stringify(this.widgets), 'utf-8');

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Saved', this.widgets.length, 'screens', diffTime, 'ms');
	}
}

export default new WidgetService();
