<template>
	<div class="users-list-view">
		<div class="header">
			<h2 v-if="totalUsers > 0">You have access to the profile of {{ totalUsers }} users</h2>
			<h2 v-else>You do not have access to any users or there are none</h2>
			<hr />
		</div>
		<div
			v-if="totalUsers > 0"
			class="users-list">
			<UserCard
				v-for="user in users"
				:key="user.id"
				:user="user"
				:class="{ 'user-card--selected': selectedUser === user.id }" />
		</div>
	</div>
</template>

<script lang="ts">
	import { ref, defineComponent, onMounted, onUnmounted } from "vue"
	import type { User } from "#/user"
	import { useUser } from "@/composables/useUser.composable"
	import UserCard from "@/components/user/UserCard.vue"
	import { EventTypes, handleEvent } from "@/composables/useUser.composable"

	export default defineComponent({
		name: "UsersListView",
		components: {
			UserCard,
		},
		setup() {
			const users = ref<User[]>([])
			const totalUsers = ref(0)
			const selectedUser = ref<string | null>(null)
			const { getAllUsers } = useUser()

			const fetchUsers = async () => {
				const token = localStorage.getItem("token")
				if (token) {
					try {
						const usersData = await getAllUsers(token)
						users.value = usersData
						totalUsers.value = usersData.length
					} catch (error) {
						console.error("Error fetching users:", error)
					}
				} else {
					console.error("No token found in localStorage")
				}
			}

			const handleUserSelect = (userId: string) => {
				selectedUser.value = userId
			}

			onMounted(() => {
				fetchUsers()
				handleEvent("on", EventTypes.USER_SELECTED_FOR_FETCHING_SESSIONS, handleUserSelect)
			})

			onUnmounted(() => {
				handleEvent("off", EventTypes.USER_SELECTED_FOR_FETCHING_SESSIONS, handleUserSelect)
			})

			return {
				users,
				totalUsers,
				selectedUser,
			}
		},
	})
</script>

<style scoped>
	.users-list-view {
		background-color: #f8f7f1;
		border-radius: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 20px;
		width: 100%; /* Takes the full width of the parent container */
		max-height: 410px; /* Set the maximum height to make it less tall */
		overflow-y: auto; /* Enable vertical scrolling if content exceeds max-height */
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

	.users-list {
		display: flex;
		flex-direction: column;
		width: 100%; /* Takes the full width of the parent container */
		gap: 10px;
	}
</style>
