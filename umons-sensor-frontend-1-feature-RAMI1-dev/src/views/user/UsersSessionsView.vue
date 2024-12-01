<template>
	<div class="users-sessions-view">
		<div class="users-list-container">
			<UsersList />
		</div>
		<div class="sessions-list-container">
			<SessionList />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import UsersList from "@/components/user/UsersList.vue"
	import SessionList from "@/components/session/SessionsList.vue"

	export default defineComponent({
		name: "UsersSessionsView",
		components: {
			UsersList,
			SessionList,
		},
	})
</script>

<style scoped>
	.users-sessions-view {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.users-list-container {
		width: 100%;
	}

	.sessions-list-container {
		width: 100%;
		padding-top: 20px;
	}
</style>
