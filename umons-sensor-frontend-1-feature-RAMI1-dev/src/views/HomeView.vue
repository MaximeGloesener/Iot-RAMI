<script lang="ts">
	import { defineComponent } from "vue"
	import MeasurementCard from "@/components/MeasurementCard.vue"
	import { useMeasurementStore } from "@/stores/measurement"
	import type { SensorWithProperty } from "#/measurement"
	import LineChart from "@/components/LineChart.vue"

	export default defineComponent({
		name: "HomeView",
		components: {
			LineChart,
			MeasurementCard,
		},
		data() {
			return {
				measurementTypes: [] as string[],
				sensors: [] as SensorWithProperty[],
				searchedSensor: "",
				displayChart: false,
				sensor: "",
				type: "",
			}
		},
		methods: {
			useMeasurementStore,
			async refreshData() {
				await useMeasurementStore().refresh()
				this.measurementTypes = useMeasurementStore().getMeasurementTypes()
				this.sensors = useMeasurementStore().getSensors()
			},
			setMeasurementAvailable(sensorName: string) {
				useMeasurementStore().setSensorAvailability(sensorName, true)
			},
			handleChartUpdate(type: string, sensor: string) {
				this.sensor = sensor
				this.type = type
				this.displayChart = true
			},
		},
		mounted() {
			this.refreshData()
		},
		computed: {
			filteredSensors(): SensorWithProperty[] {
				return this.searchedSensor === "" ? this.sensors : this.sensors.filter(sensor => sensor.name.toLowerCase().includes(this.searchedSensor.toLowerCase()))
			},
		},
	})
</script>

<template>
	<div
		:class="[displayChart ? ['split', 'left'] : '']"
		class="home">
		<h2>Measurements</h2>
		<div class="search-nav">
			<input
				v-model="searchedSensor"
				placeholder="Enter a sensor name" />
		</div>
		<section
			v-if="searchedSensor !== ''"
			class="cards-section">
			<div class="flex-container">
				<div
					v-for="filteredSensor in filteredSensors"
					:key="filteredSensor.name"
					class="container">
					<h3>{{ filteredSensor.name }}</h3>
					<button @click="setMeasurementAvailable(filteredSensor.name)">Set measurement available</button>
					<div class="measurement-card-container">
						<div v-if="filteredSensor.propertyVerified">
							<measurement-card
								v-for="measurementType in measurementTypes"
								:key="measurementType"
								:measurement-type="measurementType"
								:sensor-name="filteredSensor.name"
								@chart-data-updated="handleChartUpdate"></measurement-card>
						</div>
					</div>
				</div>
			</div>
			<div
				v-if="filteredSensors.length === 0"
				class="no-sensor">
				No sensor found
			</div>
		</section>
	</div>
	<line-chart
		v-show="displayChart"
		:sensor="sensor"
		:type="type"
		class="split right" />
</template>

<style lang="scss" scoped>
	h2,
	h3 {
		text-align: center;
		font-weight: bold;
	}

	h2 {
		font-size: 300%;
	}

	h3 {
		font-size: 175%;
	}

	.search-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1vw;
	}

	input {
		font-size: 125%;
		padding: 0 1vw;

		&::placeholder {
			text-align: left;
		}
	}

	.flex-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.container {
		flex: 0 0 30%;
		margin: 1vw;
	}

	.measurement-card-container {
		margin-top: 2vh;
	}

	.no-sensor {
		text-align: center;
		margin: 3vw;
		color: var(--color-danger);
		font-size: 200%;
	}

	@media (min-width: 900px) {
		.split {
			height: 100%;
			width: 50%;
			position: fixed;
			z-index: 1;
			top: 0;
			overflow-x: hidden;
			padding-top: 2vh;
		}

		.left {
			left: 0;
		}

		.right {
			right: 0;
		}
	}

	@media (max-width: 900px) {
		.left {
			position: fixed;
			top: 0;
			height: 60%;
			width: 100%;
			text-align: center;
		}

		.home {
			height: 60%;
			overflow-y: auto;
		}
		.right {
			position: fixed;
			bottom: 0;
			height: 40%;
			width: 100%;
			text-align: center;
		}
	}
</style>
