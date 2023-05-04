// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			key: string;
			embedded?: boolean;
			params?: Record<string, unknown>;
		}

		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
