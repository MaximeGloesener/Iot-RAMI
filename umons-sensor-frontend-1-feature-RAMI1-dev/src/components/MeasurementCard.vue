<template>
	<div class="measurement-card">
		<div class="container">
			<div
				v-show="measurements.length !== 0"
				:class="{ expanded: expandCard }"
				class="card"
				@click="expandCard = !expandCard">
				<div class="card-top">
					<h2>{{ measurementType }}</h2>
					<p>
						<span class="measurement">{{ lastMeasurement() }}</span>
					</p>
					<p class="timestamp">{{ lastMeasurementTimestamp() }}</p>
				</div>
				<div class="card-bottom">
					<div class="table-container">
						<table class="data-table">
							<thead>
								<tr>
									<th>Value</th>
									<th>Timestamp</th>
								</tr>
							</thead>
							<tbody id="data-table-body">
								<tr
									v-for="measurement in lastNMeasurements(10)"
									:key="measurement.timestamp">
									<td>{{ measurement.value }}</td>
									<td>{{ beautifyDate(measurement.timestamp) }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<button
			v-show="measurements.length !== 0"
			@click="setChartAvailableAndEmit">
			Set chart available
		</button>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import { useMeasurementStore } from "@/stores/measurement"
	import type { Measurement } from "#/measurement"

	interface DataComponent {
		measurements: Measurement[]
		isChartAvailable: boolean
		expandCard: boolean
	}

	export default defineComponent({
		name: "measurementCard",
		emits: ["chart-data-updated"],
		props: {
			measurementType: {
				type: String,
				required: true,
			},
			sensorName: {
				type: String,
				required: true,
			},
		},
		data(): DataComponent {
			return {
				measurements: [],
				isChartAvailable: false,
				expandCard: false,
			}
		},
		methods: {
			beautifyDate(date: string) {
				return new Date(date).toLocaleString()
			},
			lastNMeasurements(n: number) {
				return this.measurements.slice(-n)
			},
			lastMeasurement() {
				return this.measurements.length > 0 ? this.measurements[0].value : ""
			},
			lastMeasurementTimestamp() {
				return this.measurements.length > 0 ? this.beautifyDate(this.measurements[0].timestamp) : ""
			},

			async refreshMeasurements() {
				await useMeasurementStore().refresh()
				await useMeasurementStore().feedMeasurements()
				const data = useMeasurementStore().getMeasurementsByTypeAndSensor(this.measurementType, this.sensorName)
				if (data) {
					this.measurements = data.slice(0, 10)
				}
			},
			setChartAvailableAndEmit() {
				this.$emit("chart-data-updated", this.measurementType, this.sensorName)
			},
		},
		async mounted() {
			await this.refreshMeasurements()
		},
	})
</script>

<style lang="scss" scoped>
	.container {
		align-items: center;
		display: flex;
		justify-content: center;
	}

	.card {
		box-sizing: border-box;
		height: 25vh;
		overflow: hidden;
		box-shadow: 0 10px 20px var(--color-shadow);
		width: 100%;
		cursor: pointer;

		&.expanded {
			height: fit-content;
		}
	}

	.card-top {
		box-sizing: border-box;
		display: flex;
		justify-content: space-evenly;
		flex-direction: column;
		color: var(--color-text);
		align-items: center;
		height: 25vh;
		background: var(--color-primary);
		transition: all 0.5s ease-out;

		&:hover {
			background: var(--color-primary-hover);
		}
	}

	.card-bottom {
		box-sizing: border-box;
		height: fit-content;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		text-align: left;
		padding: 3vh 2vw;
		background: var(--color-primary);
	}

	h2,
	p {
		text-align: center;
	}

	h2 {
		font-size: 175%;
		text-transform: capitalize;
	}

	p {
		font-size: 125%;
	}

	.measurement,
	h2,
	h3 {
		font-weight: bold;
	}

	.timestamp {
		font-style: italic;
	}

	.table-container {
		margin-top: 1vh;

		.data-table {
			width: 100%;
			border-collapse: collapse;
			text-align: center;
			border: 1px solid var(--color-text);

			th {
				font-weight: bold;
			}

			th,
			td {
				border: 1px solid var(--color-text);
				padding: 1vh 1vw;
				color: var(--color-text);
			}
		}
	}
</style>
