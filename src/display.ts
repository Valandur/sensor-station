import { differenceInMilliseconds } from 'date-fns';
import { Gpio } from 'onoff';

import { RenderContext } from './context';
import { Screen } from './screen';

const ray = require('raylib');

const GESTURE_TAP = 1;
const GESTURE_SWIPE_RIGHT = 16;
const GESTURE_SWIPE_LEFT = 32;

const SHOW_TIME = 20000;

export interface Color {}

export class Display {
	public readonly ray = ray;
	public readonly WIDTH: number;
	public readonly HEIGHT: number;
	public readonly WHITE: Color = ray.WHITE;
	public readonly BLACK: Color = ray.BLACK;
	public readonly ORANGE: Color = ray.ORANGE;
	public readonly GREEN: Color = ray.GREEN;
	public readonly BLUE: Color = ray.BLUE;
	public readonly GRAY: Color = ray.GRAY;
	public readonly LIGHTGRAY: Color = ray.LIGHTGRAY;
	public font: any;

	private screens: Screen[] = [];
	private current: number = 0;
	private get screen() {
		return this.screens[this.current];
	}
	private context: RenderContext;

	private tapTimeout: NodeJS.Timeout;
	private screenTimeout: NodeJS.Timeout;
	private screenTimeoutStart: Date;
	private screenTimeoutTime: number;
	private buttonPrev: Gpio;
	private buttonNext: Gpio;
	private buttonDie: Gpio;

	public shouldExit: boolean = false;

	public constructor(width: number, height: number) {
		this.WIDTH = width;
		this.HEIGHT = height;
	}

	public startScreenTimeout(): void {
		if (this.screenTimeout) {
			clearTimeout(this.screenTimeout);
		}

		if (this.screens.length > 1) {
			this.screenTimeoutStart = new Date();
			this.screenTimeoutTime = SHOW_TIME;
			this.screenTimeout = setTimeout(() => this.nextScreen(), this.screenTimeoutTime);
		}
	}

	public stopScreenTimeout(): void {
		if (this.screenTimeout) {
			clearTimeout(this.screenTimeout);
			this.screenTimeout = null;
		}

		this.screenTimeoutStart = null;
		this.screenTimeoutTime = null;
	}

	public addScreen(screen: Screen): void {
		this.screens.push(screen);
	}

	private decScreen() {
		this.current--;
		if (this.current < 0) {
			this.current = this.screens.length - 1;
		}
	}
	public prevScreen(): void {
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
	public nextScreen(): void {
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

	public async run(): Promise<void> {
		try {
			console.log('initializing...');
			this.buttonPrev = new Gpio(22, 'in', 'both', { activeLow: true });
			this.buttonPrev.watch((err, value) => (value === 1 ? this.prevScreen() : null));

			this.buttonNext = new Gpio(23, 'in', 'both', { activeLow: true });
			this.buttonNext.watch((err, value) => (value === 1 ? this.nextScreen() : null));

			this.buttonDie = new Gpio(27, 'in', 'both', { activeLow: true });
			this.buttonDie.watch((err, value) => (value === 1 ? process.kill(process.pid, 'SIGKILL') : null));

			ray.InitWindow(this.WIDTH, this.HEIGHT, 'main');
			ray.SetTargetFPS(10);
			ray.SetGesturesEnabled(GESTURE_TAP | GESTURE_SWIPE_RIGHT | GESTURE_SWIPE_LEFT);

			this.font = ray.LoadFont('./fonts/arial.fnt');

			this.context = new RenderContext(this);

			for (const screen of this.screens) {
				console.log(`setup ${screen.name}`);
				await screen.init();
			}

			this.startScreenTimeout();
			if (this.screen.onShow) {
				this.screen.onShow();
			}

			console.log('running...');

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

				this.screen.render(); // Prepares drawing stuff

				ray.BeginDrawing();
				ray.ClearBackground(ray.BLACK);

				this.screen.draw(); // Actually draws everything

				if (this.screens.length > 1 && this.screenTimeoutStart) {
					this.drawScreenSwitcher();
				}

				ray.EndDrawing();

				await new Promise((resolve) => setTimeout(resolve, 50));
			}
		} finally {
			console.log('disposing...');
			this.dispose();
		}
	}

	public dispose(): void {
		clearInterval(this.tapTimeout);
		clearInterval(this.screenTimeout);

		this.buttonPrev.unwatchAll();
		this.buttonPrev.unexport();

		this.buttonNext.unwatchAll();
		this.buttonNext.unexport();

		ray.CloseWindow();

		for (const screen of this.screens) {
			screen.dispose();
		}
	}

	private drawScreenSwitcher() {
		ray.DrawRectangle(
			0,
			this.HEIGHT - 2,
			(differenceInMilliseconds(new Date(), this.screenTimeoutStart) / this.screenTimeoutTime) * this.WIDTH,
			2,
			ray.GRAY
		);
	}
}
