<template>
	<div class="session-container">
		<p>{{ formatHumanReadableDate(session.createdAt) }}</p>
		<p v-if="session.endedAt">Durée: {{ calculateDuration(session.createdAt, session.endedAt) }}</p>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import { useSensor } from "@/composables/useSensor.composable"

	export default defineComponent({
		props: {
			session: {
				type: Object,
				required: true,
			},
		},
		setup() {
			const { calculateDuration, formatHumanReadableDate } = useSensor(undefined)

			return {
				calculateDuration,
				formatHumanReadableDate,
			}
		},
	})
</script>
