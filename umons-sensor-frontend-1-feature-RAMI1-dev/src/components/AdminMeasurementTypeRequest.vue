<script lang="ts">
	import { defineComponent } from "vue"
	import { useUserSensorOrMeasurementTypeStore } from "@/stores/userSensorOrMeasurementType"
	import { Status } from "#/userSensor"
	import useUserSensorOrMeasurementType from "@/composables/useUserSensorOrMeasurementType.composable"
	import { useDate } from "@/composables/useDate.composable"
	import type { UserMeasurementTypeRequest } from "#/userMeasurementType"

	export default defineComponent({
		name: "AdminMeasurementTypeRequest",
		data() {
			return {
				userMeasurementType: [] as UserMeasurementTypeRequest[],
				sortDirection: "asc",
				sortColumn: "User.email",
				statusDisplay: "all",
				status: ["all", Status.ACCEPTED, Status.PENDING, Status.REJECTED],
			}
		},
		computed: {
			filteredUsers() {
				if (this.statusDisplay === "all") {
					return this.userMeasurementType
				} else {
					return this.userMeasurementType.filter(user => user.status === this.statusDisplay)
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

				this.userMeasurementType.sort((a, b) => {
					if (column === "User.email") {
						return this.sortDirection === "asc" ? a.User.email.localeCompare(b.User.email) : b.User.email.localeCompare(a.User.email)
					}
					if (column === "measurementType") {
						return this.sortDirection === "asc" ? a.measurementType.localeCompare(b.measurementType) : b.measurementType.localeCompare(a.measurementType)
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
			async submitUpdateUserRequest(userMeasurementType: UserMeasurementTypeRequest, accessApi: string) {
				const { error, data } = await useUserSensorOrMeasurementType().updateUserMeasurementTypeRequest(userMeasurementType.User.email, userMeasurementType.measurementType, accessApi)
				error ? alert(error) : alert(data)
				this.userMeasurementType = useUserSensorOrMeasurementTypeStore().getUserMeasurementTypeRequest()
			},
			beautifulDate(date: string) {
				return useDate().beautifulDate(date)
			},
		},
		async mounted() {
			const store = useUserSensorOrMeasurementTypeStore()
			await store.refresh()
			this.userMeasurementType = store.getUserMeasurementTypeRequest()
		},
	})
</script>

<template>
	<div class="admin-sensor-request">
		<h1>Admin Request</h1>
		<section>
			<h2>Grant or revoke measurement type creation</h2>
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
						<th @click="sortTable('measurementType')">Measurement Type</th>
						<th @click="sortTable('status')">Status</th>
						<th @click="sortTable('created_at')">Created at</th>
						<th>Accept</th>
						<th>Reject</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="user in filteredUsers"
						:key="user.User.email + user.measurementType + user.status">
						<td>{{ user.User.email }}</td>
						<td>{{ user.measurementType }}</td>
						<td>{{ user.status }}</td>
						<td>{{ beautifulDate(user.createdAt) }}</td>
						<td>
							<button @click="submitUpdateUserRequest(user, 'false')">Accept</button>
						</td>
						<td>
							<button @click="submitUpdateUserRequest(user, 'true')">Rejected</button>
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
