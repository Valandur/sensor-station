import { differenceInMilliseconds } from 'date-fns';
import { Gpio } from 'onoff';

import { RenderContext } from './render';
import { Screen } from './screen';

const ray = require('raylib');

const GESTURE_TAP = 1;
const GESTURE_SWIPE_RIGHT = 16;
const GESTURE_SWIPE_LEFT = 32;

const SHOW_TIME = 20000;

export class Display {
	private width: number = 0;
	private height: number = 0;
	private font: any;

	private screens: [Screen, RenderContext][] = [];
	private current: number = 0;
	private get screen() {
		return this.screens[this.current][0];
	}
	private get context() {
		return this.screens[this.current][1];
	}

	private tapTimeout: NodeJS.Timeout;
	private screenTimeout: NodeJS.Timeout;
	private screenTimeoutStart: Date;
	private screenTimeoutTime: number;
	private buttonPrev: Gpio;
	private buttonNext: Gpio;
	private buttonDie: Gpio;

	public shouldExit: boolean = false;

	public init(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.buttonPrev = new Gpio(22, 'in', 'both', { activeLow: true });
		this.buttonPrev.watch((err, value) => (value === 1 ? this.prevScreen() : null));

		this.buttonNext = new Gpio(23, 'in', 'both', { activeLow: true });
		this.buttonNext.watch((err, value) => (value === 1 ? this.nextScreen() : null));

		this.buttonDie = new Gpio(27, 'in', 'both', { activeLow: true });
		this.buttonDie.watch((err, value) => (value === 1 ? process.kill(process.pid, 'SIGKILL') : null));

		ray.InitWindow(width, height, 'main');
		ray.SetTargetFPS(10);
		ray.SetGesturesEnabled(GESTURE_TAP | GESTURE_SWIPE_RIGHT | GESTURE_SWIPE_LEFT);

		this.font = ray.LoadFont('./fonts/arial.fnt');

		this.startScreenTimeout();
		if (this.screen.onShow) {
			this.screen.onShow();
		}
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

	public startScreenTimeout() {
		if (this.screenTimeout) {
			clearTimeout(this.screenTimeout);
		}

		if (this.screens.length > 1) {
			this.screenTimeoutStart = new Date();
			this.screenTimeoutTime = this.screen?.showTime || SHOW_TIME;
			this.screenTimeout = setTimeout(() => this.nextScreen(), this.screenTimeoutTime);
		}
	}

	public stopScreenTimeout() {
		if (this.screenTimeout) {
			clearTimeout(this.screenTimeout);
			this.screenTimeout = null;
		}

		this.screenTimeoutStart = null;
		this.screenTimeoutTime = null;
	}

	public addScreen(screen: Screen) {
		this.screens.push([screen, new RenderContext(ray)]);
	}

	private decScreen() {
		this.current--;
		if (this.current < 0) {
			this.current = this.screens.length - 1;
		}
	}
	public prevScreen() {
		if (this.screen.onHide) {
			this.screen.onHide();
		}

		do {
			this.decScreen();
		} while (!this.canShowScreen());

		this.startScreenTimeout();
		if (this.screen.onShow) {
			this.screen.onShow();
		}
	}

	private incScreen() {
		this.current = (this.current + 1) % this.screens.length;
	}
	public nextScreen() {
		if (this.screen.onHide) {
			this.screen.onHide();
		}

		do {
			this.incScreen();
		} while (!this.canShowScreen());

		this.startScreenTimeout();
		if (this.screen.onShow) {
			this.screen.onShow();
		}
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

			this.screen.render(this.context); // Prepares drawing stuff

			ray.BeginDrawing();
			ray.ClearBackground(ray.BLACK);

			this.context.render(); // Actually draws everything

			if (this.screens.length > 1 && this.screenTimeoutStart) {
				this.drawScreenSwitcher();
			}

			ray.EndDrawing();

			await new Promise((resolve) => setTimeout(resolve, 0));
		}
	}

	private drawScreenSwitcher() {
		ray.DrawRectangle(
			0,
			this.height - 2,
			(differenceInMilliseconds(new Date(), this.screenTimeoutStart) / this.screenTimeoutTime) * this.width,
			2,
			ray.GRAY
		);
	}
}
