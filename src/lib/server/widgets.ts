import { dirname } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { error, fail } from '@sveltejs/kit';

import { BaseLogger } from '$lib/models/BaseLogger';
import { CALENDAR_WIDGET_TYPE } from '$lib/models/calendar';
import { EPIC_GAMES_WIDGET_TYPE } from '$lib/models/epic-games';
import { GALLERY_WIDGET_TYPE } from '$lib/models/gallery';

import type { BaseWidget } from './BaseWidget';
import { CalendarWidget } from './calendar/widget';
import { EpicGamesWidget } from './epic-games/widget';
import { GalleryWidget } from './gallery/widget';

type WidgetConstructor = new (name: string, type: string, config?: any) => BaseWidget;
type WidgetMap = { [key: string]: WidgetConstructor & { actions: Readonly<string[]> } };

const WIDGETS_PATH = 'data/widgets.json';
const WIDGETS: WidgetMap = {
	[CALENDAR_WIDGET_TYPE]: CalendarWidget,
	[EPIC_GAMES_WIDGET_TYPE]: EpicGamesWidget,
	[GALLERY_WIDGET_TYPE]: GalleryWidget
};

class WidgetManager {
	private loaded: boolean = false;
	private logger: BaseLogger = new BaseLogger('WIDGETS');
	private widgets: Map<string, BaseWidget> = new Map();

	public constructor() {}

	public async load() {
		if (this.loaded) {
			return;
		}

		this.logger.debug('Loading...');
		const startTime = process.hrtime.bigint();

		await mkdir(dirname(WIDGETS_PATH), { recursive: true });
		const rawWidgets = JSON.parse(await readFile(WIDGETS_PATH, 'utf-8').catch(() => '[]'));

		const widgets: Map<string, BaseWidget> = new Map();
		for (const rawWidget of rawWidgets) {
			const constr = WIDGETS[rawWidget.type];
			const service = new constr(rawWidget.name, rawWidget.type, rawWidget.config);
			widgets.set(rawWidget.name, service);
		}

		this.widgets = widgets;
		this.loaded = true;

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Loaded', this.widgets.size, 'widgets', diffTime, 'ms');
	}

	public async add(name: string, type: string) {
		if (this.widgets.has(name)) {
			throw fail(400, { key: 'widgets.duplicate', message: 'Duplicate widget name' });
		}

		const constr = WIDGETS[type];
		const widget = new constr(name, type);
		this.widgets.set(name, widget);

		await this.save();
	}

	public async remove(name: string) {
		this.widgets.delete(name);

		await this.save();
	}

	public async save() {
		this.logger.debug('Saving...');
		const startTime = process.hrtime.bigint();

		const widgets = [...this.widgets.values()].map((s) => ({
			name: s.name,
			type: s.type,
			config: s.config
		}));
		await writeFile(WIDGETS_PATH, JSON.stringify(widgets), 'utf-8');

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Saved', this.widgets.size, 'widgets', diffTime, 'ms');
	}

	public getTypes() {
		return Object.entries(WIDGETS).map(([type, clazz]) => ({
			name: type,
			actions: clazz.actions
		}));
	}

	public getInstances(type?: string) {
		return [...this.widgets.values()]
			.filter((i) => !type || i.type === type)
			.map((s) => ({ name: s.name, type: s.type }));
	}

	public getByName<WIDGET extends BaseWidget = BaseWidget>(name: string): WIDGET {
		const widget = this.widgets.get(name);
		if (!widget) {
			error(404, { key: 'widgets.notFound', message: `Widget ${name} not found` });
		}
		return widget as WIDGET;
	}
}

export default new WidgetManager();
