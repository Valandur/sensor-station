declare module '@westh/serial-commander' {
	export interface ConstructorOptions {
		port?: string;
		defaultDelay?: number;
		disableLog?: boolean;
		log?: (arg: string) => void;
	}

	export interface SendOptions {
		timeout?: number;
	}

	export default class SerialCommander {
		public constructor(opts: ConstructorOptions);

		public send(command: string, options?: SendOptions): Promise<{ response: string }>;
		public close(): Promise<void>;
	}
}
