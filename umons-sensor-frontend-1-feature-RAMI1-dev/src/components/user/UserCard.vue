<template>
	<div
		class="user-card"
		@click="selectUser">
		<div class="user-info-section">
			<p class="user-detail">{{ user.firstName }} {{ user.lastName }}</p>
			<p class="user-detail">{{ formatHumanReadableDate(user.dateOfBirth, true) }}</p>
			<p class="user-detail">{{ user.sex }}</p>
			<p class="user-detail">{{ user.email }}</p>
			<p class="user-detail">{{ user.role }}</p>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import { EventTypes, handleEvent } from "@/composables/useUser.composable"
	import type { PropType } from "vue"
	import type { User } from "#/user"
	import { useSensor } from "@/composables/useSensor.composable"

	export default defineComponent({
		name: "UserCard",
		props: {
			user: {
				type: Object as PropType<User>,
				required: true,
			},
		},
		setup(props) {
			const { formatHumanReadableDate } = useSensor(undefined)

			const selectUser = () => {
				handleEvent("emit", EventTypes.USER_SELECTED_FOR_FETCHING_SESSIONS, props.user.id)
			}

			return {
				selectUser,
				formatHumanReadableDate,
			}
		},
	})
</script>

<style scoped>
	.user-card {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		padding: 15px 20px;
		margin-bottom: 10px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		width: 100%; /* Ensures the card takes up full width of the container */
		justify-content: space-between;
	}

	.user-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.user-card--selected {
		border-color: #007bff;
		background-color: #e7f1ff;
	}

	.user-info-section {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-between;
	}

	.user-detail {
		margin: 0 20px; /* Increase margin for more space between details */
		position: relative;
		padding-left: 20px; /* Increase padding for more space before the separator */
		flex: 1;
		text-align: center;
	}

	.user-detail::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 1px;
		height: 60%;
		background-color: #ddd;
	}

	.user-info-section .user-detail:first-child::before {
		display: none; /* No separator before the first element */
	}

	.details-button:hover {
		background-color: #0056b3;
	}
</style>
