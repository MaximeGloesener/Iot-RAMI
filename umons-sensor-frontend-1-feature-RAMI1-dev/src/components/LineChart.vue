<script lang="ts">
	import { defineComponent } from "vue"
	import { useChart } from "@/composables/useChart.composable"
	import { useMeasurement } from "@/composables/useMeasurement.composable"
	import { useMeasurementStore } from "@/stores/measurement"
	import OptionSelector from "@/components/OptionSelector.vue"
	import { useInformationMeasurement } from "@/composables/useInformationMeasurement.composable"

	export default defineComponent({
		name: "LineChart",
		components: { OptionSelector },
		props: {
			type: {
				type: String,
				required: true,
			},
			sensor: {
				type: String,
				required: true,
			},
		},
		data() {
			return {
				sampleSelected: "",
				pointSelected: 8,
				minimumValue: 0,
				maximumValue: 0,
				averageValue: 0,
				sampleOptions: useMeasurementStore().getOptionsByName("samples"),
				pointOptions: useMeasurementStore().getOptionsByName("points"),
			}
		},
		methods: {
			useMeasurementStore,
			updateChart() {
				if (!this.sensor || !this.type) {
					return
				}

				const valueArray = useMeasurement().getValueArrayByTypeAndSensor(this.type, this.sensor)
				this.averageValue = useInformationMeasurement().averageValue(valueArray)
				this.minimumValue = Math.min(...valueArray)
				this.maximumValue = Math.max(...valueArray)

				useChart().updateChart(
					useMeasurement().getTimestampArrayByTypeAndSensor(this.type, this.sensor),
					useMeasurement().getValueArrayByTypeAndSensor(this.type, this.sensor),
					this.sensor,
					this.type,
					"dataChart"
				)
			},
			handleOptionSelectedChange(optionSelected: number, message: string) {
				switch (message) {
					case this.sampleOptions.message:
						this.sampleSelected = optionSelected.toString()
						break
					case this.pointOptions.message:
						this.pointSelected = optionSelected
						break
					default:
						break
				}
			},
		},
		watch: {
			async sampleSelected() {
				if (this.sampleSelected === "No sample") {
					this.sampleSelected = ""
				}
				await useMeasurementStore().feedMeasurementsSampleNumber(this.type, this.sensor, this.sampleSelected, this.pointSelected)
				this.updateChart()
			},
			async pointSelected() {
				await useMeasurementStore().feedMeasurementsSampleNumber(this.type, this.sensor, this.sampleSelected, this.pointSelected)
				this.updateChart()
			},
			type() {
				this.updateChart()
			},
			sensor() {
				this.updateChart()
			},
		},
	})
</script>

<template>
	<div class="line-chart">
		<div class="selector">
			<option-selector
				:list="sampleOptions.options"
				:message="sampleOptions.message"
				@option-selected-change="handleOptionSelectedChange" />
		</div>
		<canvas id="dataChart"></canvas>
		<div>Minimum value = {{ minimumValue }}</div>
		<div>Maximum value = {{ maximumValue }}</div>
		<div>Average value = {{ averageValue }}</div>
		<option-selector
			:list="pointOptions.options"
			:message="pointOptions.message"
			@option-selected-change="handleOptionSelectedChange" />
	</div>
</template>

<style lang="scss" scoped>
	.line-chart {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.selector {
		margin-bottom: 2vh;
	}

	@media (min-width: 900px) {
		.chart-controls span,
		.chart-controls select {
			display: block;
		}
	}
</style>
