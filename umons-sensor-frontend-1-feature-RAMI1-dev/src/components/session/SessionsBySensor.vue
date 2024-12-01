<template>
	<div class="sessions-by-sensor">
		<h3>Distribution of your sessions by sensor (Average Session Duration: {{ averageDuration }} minutes)</h3>
		<BarChart :chartData="chartDataSessionDistribution" />
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted } from "vue"
	import BarChart from "@/components/BarChart.vue"
	import { useDistributionSessionBySensor } from "@/composables/useSession.composable"

	export default defineComponent({
		name: "SessionsBySensor",
		components: {
			BarChart,
		},
		setup() {
			const { chartDataSessionDistribution, averageDuration, fetchSessionsBySensor } = useDistributionSessionBySensor()

			onMounted(() => {
				fetchSessionsBySensor()
			})

			return {
				chartDataSessionDistribution,
				averageDuration,
			}
		},
	})
</script>

<style scoped>
	.sessions-by-sensor {
		padding: 20px;
		background-color: #f5f5f5;
		border-radius: 10px;
		text-align: center;
	}

</style>
