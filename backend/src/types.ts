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

declare module 'get-video-dimensions' {
	export default function getDimensions(fileName: string): Promise<{ width: number; height: number }>;
}

declare module 'http' {
	interface File {
		name: string;
		mimetype: string;
		data: Buffer;
		md5: string;
		mv: (path: string) => void;
	}

	interface IncomingMessage {
		files: File[];
	}
}
