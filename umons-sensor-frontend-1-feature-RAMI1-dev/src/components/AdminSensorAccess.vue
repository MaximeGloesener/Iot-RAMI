<script lang="ts">
	import { defineComponent } from "vue"
	import type { UserSensorAccess } from "#/userSensor"
	import { Status } from "#/userSensor"
	import useUserSensorOrMeasurementType from "@/composables/useUserSensorOrMeasurementType.composable"
	import { useDate } from "@/composables/useDate.composable"
	import { useUserSensorOrMeasurementTypeStore } from "@/stores/userSensorOrMeasurementType"

	export default defineComponent({
		name: "AdminSensorAccess",
		data() {
			return {
				usersSensor: [] as UserSensorAccess[],
				sortDirection: "asc",
				sortColumn: "User.email",
				statusDisplay: "all",
				status: ["all", Status.ACCEPTED, Status.PENDING, Status.REJECTED],
			}
		},
		computed: {
			filteredUsers() {
				if (this.statusDisplay === "all") {
					return this.usersSensor
				} else {
					return this.usersSensor.filter(user => user.status === this.statusDisplay)
				}
			},
		},
		methods: {
			sortTable(column: string) {
				if (column === this.sortColumn) {
					this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
				} else {
					this.sortColumn = column
					this.sortDirection = "asc"
				}

				this.usersSensor.sort((a, b) => {
					if (column === "User.email") {
						return this.sortDirection === "asc" ? a.User.email.localeCompare(b.User.email) : b.User.email.localeCompare(a.User.email)
					}
					if (column === "Sensor.name") {
						return this.sortDirection === "asc" ? a.Sensor.name.localeCompare(b.Sensor.name) : b.Sensor.name.localeCompare(a.Sensor.name)
					}
					if (column === "status") {
						return this.sortDirection === "asc" ? a.status.toString().localeCompare(b.status.toString()) : b.status.toString().localeCompare(a.status.toString())
					}
					if (column === "created_at") {
						return this.sortDirection === "asc" ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)
					}
					return 0
				})
			},
			async submitUpdateUserAccess(userSensor: UserSensorAccess, accessApi: string) {
				const { error, data } = await useUserSensorOrMeasurementType().updateUserSensorAccess(userSensor.User.email, userSensor.Sensor.name, accessApi)
				error ? alert(error) : alert(data)
				this.usersSensor = useUserSensorOrMeasurementTypeStore().getUserSensorAccess()
			},
			beautifulDate(date: string) {
				return useDate().beautifulDate(date)
			},
		},
		async mounted() {
			const store = useUserSensorOrMeasurementTypeStore()
			await store.refresh()
			this.usersSensor = store.getUserSensorAccess()
		},
	})
</script>

<template>
	<div class="admin-sensor-access">
		<h1>Admin Access</h1>
		<section>
			<h2>Grant or revoke access</h2>
			<form>
				<label for="status">Filter by status</label>
				<select
					id="status"
					v-model="statusDisplay">
					<option value="pending">Show Pending</option>
					<option value="accepted">Show Accepted</option>
					<option value="rejected">Show Rejected</option>
					<option value="all">Show All</option>
				</select>
			</form>
			<table class="user-table">
				<thead>
					<tr>
						<th @click="sortTable('User.email')">User</th>
						<th @click="sortTable('Sensor.name')">Sensor</th>
						<th @click="sortTable('status')">Status</th>
						<th @click="sortTable('created_at')">Created at</th>
						<th>Accept</th>
						<th>Reject</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="user in filteredUsers"
						:key="user.User.email + user.Sensor.name + user.status">
						<td>{{ user.User.email }}</td>
						<td>{{ user.Sensor.name }}</td>
						<td>{{ user.status }}</td>
						<td>{{ beautifulDate(user.createdAt) }}</td>
						<td>
							<button @click="submitUpdateUserAccess(user, 'false')">Accept</button>
						</td>
						<td>
							<button @click="submitUpdateUserAccess(user, 'true')">Rejected</button>
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	</div>
</template>

<style lang="scss" scoped>
	.user-table {
		width: 100%;
		border-collapse: collapse;

		th {
			background-color: var(--color-background);
			font-weight: bold;
			cursor: pointer;
		}

		td,
		th {
			padding: 10px;
			border: 1px solid var(--color-shadow);
		}

		tbody tr:hover {
			background-color: var(--color-secondary-hover);
		}

		button {
			padding: 5px 10px;
			border: none;
			color: var(--color-text-second);
			cursor: pointer;

			&.accept {
				background-color: var(--color-primary);

				&:hover {
					background-color: var(--color-primary-hover);
				}
			}

			&.reject {
				background-color: var(--color-danger);

				&:hover {
					background-color: var(--color-danger-hover);
				}
			}
		}
	}
</style>
