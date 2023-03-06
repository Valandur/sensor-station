<script lang="ts">
	import { LineChart } from '@carbon/charts-svelte';
	import { getContextClient, queryStore } from '@urql/svelte';

	import { GET_RECORDINGS, type GetRecordingsData } from '$lib/models/sensors';

	import '@carbon/charts/styles.css';

	$: client = getContextClient();
	$: store = queryStore<GetRecordingsData>({
		query: GET_RECORDINGS,
		context: { additionalTypenames: ['SensorRecording'] },
		client
	});
	$: recordings = $store.data?.sensors.recordings || [];
	$: data = {
		labels: ['Temperature', 'Relative Humidity'],
		datasets: [
			{
				label: 'Temperature °C',
				data: recordings.map((r) => ({ date: r.ts, value: r.temp, group: 'temp' })),
				color: 'red'
			},
			{
				label: 'RH %',
				data: recordings.map((r) => ({ date: r.ts, value: r.rh, group: 'rh' }))
			}
		]
	};
</script>

<LineChart
	{data}
	options={{
		title: 'Recordings',
		height: '99vh',
		theme: 'g100',
		axes: {
			left: {
				title: 'Temperature [°C]',
				domain: [-20, 50]
			},
			bottom: {
				title: 'Time',
				scaleType: 'time'
			},
			right: {
				title: 'Relative Humidity [%]',
				domain: [0, 100],
				correspondingDatasets: ['RH %']
			}
		},
		color: {
			scale: {
				'Temperature °C': '#db3030',
				'RH %': '#306fdb'
			}
		},
		toolbar: {
			enabled: false
		},
		zoomBar: {
			top: {
				enabled: true
			}
		},
		legend: {
			alignment: 'center'
		}
	}}
/>
