<template>
	<div class="sensors-view">
		<div class="sensors-list-container">
			<SensorsList />
		</div>
		<div class="sessions-list-container">
			<SessionList />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import SensorsList from "@/components/sensor/SensorsList.vue"
	import SessionList from "@/components/session/SessionsList.vue"

	export default defineComponent({
		name: "SensorsView",
		components: {
			SensorsList,
			SessionList,
		},
	})
</script>

<style scoped>
	.sensors-view {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.sensors-list-container {
		width: 100%;
	}

	.sessions-list-container {
		width: 100%;
		padding-top: 20px;
	}
</style>
