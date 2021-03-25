import { Gpio } from 'onoff';

import { Screen } from './screen';

const ray = require('raylib');

const GESTURE_TAP = 1;
const GESTURE_SWIPE_RIGHT = 16;
const GESTURE_SWIPE_LEFT = 32;

const SHOW_TIME = 20000;

export class Display {
	private screens: Screen[] = [];
	private current: number = 0;
	private get screen() {
		return this.screens[this.current];
	}

	private tapTimeout: NodeJS.Timeout;
	private screenTimeout: NodeJS.Timeout;
	private buttonPrev: Gpio;
	private buttonNext: Gpio;

	public shouldExit: boolean = false;

	public init(width: number, height: number) {
		this.buttonPrev = new Gpio(22, 'in', 'both', { activeLow: true });
		this.buttonPrev.watch((err, value) => (value === 1 ? this.prevScreen() : null));

		this.buttonNext = new Gpio(23, 'in', 'both', { activeLow: true });
		this.buttonNext.watch((err, value) => (value === 1 ? this.nextScreen() : null));

		ray.InitWindow(width, height, 'main');
		ray.SetTargetFPS(10);
		ray.SetGesturesEnabled(GESTURE_TAP | GESTURE_SWIPE_RIGHT | GESTURE_SWIPE_LEFT);
	}

	public dispose() {
		clearInterval(this.tapTimeout);
		clearInterval(this.screenTimeout);

		this.buttonPrev.unwatchAll();
		this.buttonPrev.unexport();

		this.buttonNext.unwatchAll();
		this.buttonNext.unexport();

		ray.CloseWindow();
	}

	public addScreen(screen: Screen) {
		this.screens.push(screen);
	}

	private decScreen() {
		this.current--;
		if (this.current < 0) {
			this.current = this.screens.length - 1;
		}
	}
	public prevScreen() {
		do {
			this.decScreen();
		} while (!this.canShowScreen());

		if (this.screenTimeout) {
			clearTimeout(this.screenTimeout);
		}
		this.screenTimeout = setTimeout(() => this.nextScreen(), this.screen.showTime || SHOW_TIME);
	}

	private incScreen() {
		this.current = (this.current + 1) % this.screens.length;
	}
	public nextScreen() {
		do {
			this.incScreen();
		} while (!this.canShowScreen());

		if (this.screenTimeout) {
			clearTimeout(this.screenTimeout);
		}
		this.screenTimeout = setTimeout(() => this.nextScreen(), this.screen.showTime || SHOW_TIME);
	}

	private canShowScreen() {
		return !this.screen.canShow || this.screen.canShow();
	}

	public async render() {
		while (!this.shouldExit && !ray.WindowShouldClose()) {
			const gesture = ray.GetGestureDetected();
			if (gesture === GESTURE_TAP) {
				if (this.screen.onTap) {
					const { x, y } = ray.GetTouchPosition(0);
					this.tapTimeout = setTimeout(() => this.screen.onTap({ x, y }), 200);
				}
			} else if (gesture === GESTURE_SWIPE_RIGHT) {
				clearTimeout(this.tapTimeout);
				this.prevScreen();
			} else if (gesture === GESTURE_SWIPE_LEFT) {
				clearTimeout(this.tapTimeout);
				this.nextScreen();
			}

			ray.BeginDrawing();
			ray.ClearBackground(ray.BLACK);

			this.screen.render(ray);

			ray.EndDrawing();

			await new Promise((resolve) => setTimeout(resolve, 1));
		}
	}
}
