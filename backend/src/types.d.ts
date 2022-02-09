declare module '@westh/serial-commander' {
	export interface Options {
		port: string;
		disableLog: boolean;
	}

	export default class SerialCommander {
		public constructor(opts: Options);

		public send(command: string): Promise<{ response: string }>;
		public close(): void;
	}
}
