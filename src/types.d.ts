declare module 'get-video-dimensions' {
	export default function getDimensions(
		fileName: string
	): Promise<{ width: number; height: number }>;
}
