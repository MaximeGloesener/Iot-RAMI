<template>
	<div
		class="sensor-card"
		:class="{ 'sensor-card--selected': isSelected }"
		@click="handleCardClick">
		<div class="sensor-status-section">
			<div
				class="sensor-status"
				:class="statusClass"
				@click.stop="checkSensorStatus">
				<span
					class="status-indicator"
					:title="tooltipText"></span>
				<span class="status-text">{{ status }}</span>
			</div>
		</div>
		<div class="sensor-info-section">
			<p class="sensor-name">{{ sensor.name }}</p>
			<p class="sensor-topic">{{ sensor.topic }}</p>
		</div>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, onMounted } from "vue"
	import { EventTypes, handleEvent } from "@/composables/useUser.composable"
	import { useSensor, SensorState } from "@/composables/useSensor.composable"

	export default defineComponent({
		name: "SensorCard",
		props: {
			sensor: {
				type: Object,
				required: true,
			},
			selectedSensorId: {
				type: String,
				default: null,
			},
			isForRealTimeSession: {
				type: Boolean,
				default: false,
			},
			tooltipText: {
				type: String,
			},
		},
		setup(props) {
			const { status, statusClass, checkSensorStatus } = useSensor(props.sensor.name)

			const isSelected = computed(() => props.selectedSensorId === props.sensor.id)

			const selectSensor = () => {
				if (props.isForRealTimeSession) {
					handleEvent("emit", EventTypes.SENSOR_SELECTED_FOR_CREATING_SESSION, props.sensor.id)
					//console.log("NEW EVENT >>> SENSOR NEW SESSION", props.sensor.id)
				} else {
					handleEvent("emit", EventTypes.SENSOR_SELECTED_FOR_FETCHING_SESSIONS, props.sensor.id)
					//console.log("NEW EVENT >>> SENSOR NEW SESSION FETCH")
				}
			}

			const handleCardClick = () => {
				if (props.isForRealTimeSession) {
					if (status.value === SensorState.ONLINE) {
						selectSensor()
					}
				} else {
					selectSensor()
				}
			}

			onMounted(() => {
				checkSensorStatus()
			})

			return {
				status,
				statusClass,
				checkSensorStatus,
				selectSensor,
				handleCardClick,
				SensorState,
				isSelected,
			}
		},
	})
</script>

<style scoped>
	.sensor-card {
		display: flex;
		border: 1px solid #ccc;
		padding: 20px;
		margin-bottom: 15px;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.sensor-card--selected {
		border-color: #007bff;
		background-color: #e7f1ff;
	}

	.on-clickable {
		cursor: not-allowed;
	}

	.sensor-status-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-right: 15px;
		border-right: 1px solid #ccc;
	}

	.sensor-info-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 15px;
	}

	.sensor-name {
		font-size: 1.2em;
		font-weight: bold;
	}

	.sensor-topic {
		font-size: 1em;
		color: #555;
	}

	.sensor-status {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}

	.status-indicator {
		width: 15px;
		height: 15px;
		border-radius: 50%;
	}

	.status-online .status-indicator {
		background-color: green;
	}

	.status-publishing .status-indicator {
		background-color: orange;
	}

	.status-offline .status-indicator {
		background-color: red;
	}

	.status-error .status-indicator {
		background-color: black;
	}
</style>
