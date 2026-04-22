import { writable } from 'svelte/store';

export const tz = writable(Intl.DateTimeFormat().resolvedOptions().timeZone);
