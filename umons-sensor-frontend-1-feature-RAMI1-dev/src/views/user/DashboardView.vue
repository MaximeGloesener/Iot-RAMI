<template>
	<div class="dashboard-container">
		<div class="stats">
			<SessionsBySensor />
		</div>
	</div>
	<div>
		<SessionsList />
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import SessionsBySensor from "@/components/session/SessionsBySensor.vue"
	import SessionsList from "@/components/session/SessionsList.vue"
	import { UserFields } from "#/user"
	import { EventTypes, handleEvent } from "@/composables/useUser.composable"

	export default defineComponent({
		name: "UserDashboard",
		components: {
			SessionsBySensor,
			SessionsList,
		},
		mounted() {
			const userId = localStorage.getItem(UserFields.ID)
			if (userId) {
				handleEvent("emit", EventTypes.USER_SELECTED_FOR_FETCHING_SESSIONS, userId)
			}
		},
	})
</script>

<style scoped>
	.dashboard-container {
		max-height: 700px;
	}

	.stats {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 20px;
	}
</style>
