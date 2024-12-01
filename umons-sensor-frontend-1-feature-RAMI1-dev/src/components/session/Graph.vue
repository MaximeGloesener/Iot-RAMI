<template>
	<div class="graph-container">
		<h2>{{ title }}</h2>
		<div class="chart-wrapper">
			<LineChart
				ref="chartRef"
				:data="chartData"
				:options="chartOptions" />
		</div>
		<div
			v-if="!props.isRealTime"
			class="chart-controls">
			<button @click="rewind">⏪️</button>
			<button @click="play">▶️</button>
			<button @click="pause">⏸️</button>
			<button @click="fastForward">⏩️</button>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, inject, onMounted, onUnmounted, ref } from "vue"
	import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, type ChartOptions, type ChartData } from "chart.js"
	import { Line as LineChart } from "vue-chartjs"
	import zoomPlugin from "chartjs-plugin-zoom"
	import "chartjs-adapter-date-fns"
	import { EventTypes, handleEvent } from "@/composables/useUser.composable"

	ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin)

	export default defineComponent({
		name: "SessionGraph",
		components: {
			LineChart,
		},
		props: {
			isRealTime: {
				type: Boolean,
				default: false,
			},
		},
		setup(props) {
			const title = inject<string>("title")
			const injectedChartData = inject<ChartData<"line">>("chartData")
			const chartData = ref<ChartData<"line">>(
				injectedChartData || {
					labels: [],
					datasets: [
						{
							label: "Dataset",
							data: [],
						},
					],
				}
			)
			const chartRef = ref<InstanceType<typeof LineChart> | null>(null)
			let animationInterval: ReturnType<typeof setInterval> | null = null

			const chartOptions: ChartOptions<"line"> = {
				responsive: true,
				maintainAspectRatio: true,
				elements: {
					line: {
						tension: 0.4,
					},
				},
				scales: {
					x: {
						type: "time",
						time: {
							unit: "second",
						},
						title: {
							display: true,
							text: "Time",
						},
					},
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: "Value",
						},
					},
				},
				plugins: {
					zoom: {
						pan: {
							enabled: !props.isRealTime,
							mode: "x",
						},
						zoom: {
							wheel: {
								enabled: !props.isRealTime,
							},
							pinch: {
								enabled: !props.isRealTime,
							},
							mode: "x",
						},
					},
				},
			}

			const updateScale = (direction: "forward" | "backward", stepFactor: number) => {
				if (chartRef.value) {
					const chart = chartRef.value.chart as ChartJS
					const scales = chart.options.scales
					if (scales && scales.x) {
						const xScale = scales.x
						if (typeof xScale.min === "number" && typeof xScale.max === "number") {
							const maxX = xScale.max
							const minX = xScale.min
							const step = (maxX - minX) / stepFactor
							if (direction === "forward") {
								xScale.min += step
								xScale.max += step
							} else {
								xScale.min -= step
								xScale.max -= step
							}
							chart.update("none")
						}
					}
				}
			}

			const clearAnimationInterval = () => {
				if (animationInterval) {
					clearInterval(animationInterval)
					animationInterval = null
				}
			}

			const play = () => {
				if (animationInterval) return
				animationInterval = setInterval(() => updateScale("forward", 100), 100)
			}

			const pause = () => {
				clearAnimationInterval()
			}

			const fastForward = () => {
				clearAnimationInterval()
				updateScale("forward", 10)
			}

			const rewind = () => {
				clearAnimationInterval()
				updateScale("backward", 10)
			}

			const chooseNewXScale = (date1: string, date2: string) => {
				if (chartRef.value) {
					const chart = chartRef.value.chart as ChartJS
					const scales = chart.options.scales
					if (scales && scales.x) {
						scales.x.min = date1
						scales.x.max = date2
						chart.update("resize")
					}
				}
			}

			onMounted(() => {
				if (!props.isRealTime) {
					handleEvent("on", EventTypes.SESSION_SELECTED, handleSessionSelected)
				}
			})

			onUnmounted(() => {
				if (!props.isRealTime) {
					handleEvent("off", EventTypes.SESSION_SELECTED, handleSessionSelected)
				}
			})

			const handleSessionSelected = (session: { id: string; startDate: string; endDate: string }) => {
				chooseNewXScale(session.startDate, session.endDate)
			}

			return {
				title,
				chartData,
				chartOptions,
				chartRef,
				play,
				pause,
				fastForward,
				rewind,
				chooseNewXScale,
				props,
			}
		},
	})
</script>

<style scoped>
	.graph-container {
		margin-top: 20px;
		background-color: #fff;
		padding: 20px;
		border-radius: 10px;
		width: 100%; /* Ajout d'une largeur maximale pour le conteneur */
		overflow: hidden; /* Gestion du débordement pour empêcher le graphique de sortir du conteneur */
		box-sizing: border-box; /* Assurez-vous que le padding est inclus dans la hauteur et la largeur */
		display: flex; /* Ajouté pour utiliser flexbox */
		flex-direction: column; /* Ajouté pour que les enfants soient en colonne */
	}

	.chart-wrapper {
		height: 70%; /* Assurez-vous que le wrapper prend toute la hauteur disponible */
		width: 100%; /* Ajout d'une largeur maximale pour le wrapper */
		box-sizing: border-box; /* Assurez-vous que le padding est inclus dans la hauteur et la largeur */
	}

	.chart-controls {
		display: flex;
		justify-content: center;
		margin-top: 10px;
	}

	.chart-controls button {
		background-color: #007bff;
		border: none;
		color: white;
		padding: 5px 10px;
		margin: 0 5px;
		font-size: 14px;
		border-radius: 5px;
		cursor: pointer;
	}

	.chart-controls button:hover {
		background-color: #0056b3;
	}
</style>
