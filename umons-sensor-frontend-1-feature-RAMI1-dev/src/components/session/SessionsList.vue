<template>
	<div class="container">
		<div class="header">
			<h2 v-if="sessions.length > 0">There are {{ sessions.length }} sessions</h2>
			<h2 v-else>There are no sessions</h2>
			<hr />
		</div>
		<div
			class="content"
			v-if="sessions.length > 0">
			<div class="sessions-list">
				<div
					v-for="session in sessions"
					:key="session.id"
					@click="handleSessionSelect(session.id)"
					:class="{ 'session-card--selected': selectedSession === session.id }"
					class="session-card">
					<SessionCard :session="session" />
				</div>
			</div>
			<div class="graph">
				<Graph :chartData="chartData" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, provide, onMounted, onUnmounted } from "vue"
	import SessionCard from "@/components/session/SessionCard.vue"
	import Graph from "@/components/session/Graph.vue"
	import { useSession } from "@/composables/useSession.composable"

	export default defineComponent({
		components: {
			SessionCard,
			Graph,
		},
		setup() {
			const { chartData, sessions, selectedSession, handleSessionSelect, registerOrRemoveEventHandlers } = useSession()

			provide("title", "Session Chart")
			provide("chartData", chartData)

			onMounted(() => {
				registerOrRemoveEventHandlers("on")
			})

			onUnmounted(() => {
				registerOrRemoveEventHandlers("off")
			})

			return {
				sessions,
				chartData,
				selectedSession,
				handleSessionSelect,
			}
		},
	})
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		background-color: #f8f7f1;
		border-radius: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 20px;
		width: 100%; /* Takes the full width of the parent container */
		height: 950px; /* Set the maximum height to make it less tall */
		max-height: 950px; /* Set the maximum height to make it less tall */
		margin: auto;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 10px;
	}

	.header h2 {
		font-size: 1.5em;
		font-weight: bold;
		margin: 0;
		color: #333;
	}

	.header hr {
		width: 100%;
		border: none;
		border-top: 1px solid #ddd;
		margin: 10px 0;
	}

	.content {
		display: flex;
		flex-direction: row; /* Ensure content is in a row */
		width: 100%;
	}

	.sessions-list {
		display: flex;
		flex-direction: column;
		width: 10%;
		overflow-y: auto;
		gap: 10px;
	}

	.graph {
		width: 90%; /* Because session list uses 10% of the space */
	}

	.session-card {
		border: 1px solid #ccc;
		padding: 10px;
		margin-bottom: 10px;
		background-color: #fff;
		border-radius: 10px;
		cursor: pointer;
		transition: background-color 0.3s, border-color 0.3s;
	}

	.session-card--selected {
		border-color: #007bff;
		background-color: #e7f1ff;
	}
</style>
