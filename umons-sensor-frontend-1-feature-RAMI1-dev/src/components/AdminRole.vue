<template>
	<div class="admin-role">
		<h1>Admin Role</h1>
		<section>
			<h2>Modify user role</h2>
			<form>
				<label for="userEmail">
					<span>User to modify</span>
					<select
						v-model="userSelected"
						name="user">
						<option
							v-for="user in users"
							:key="user.email"
							:value="user.email">
							{{ user.email }} - {{ user.role }}
						</option>
					</select>
				</label>
				<label for="role">
					<span>New role</span>
					<select
						v-model="roleSelected"
						name="role">
						<option
							v-for="role in roles"
							:key="role"
							:value="role">
							{{ role }}
						</option>
					</select>
				</label>
				<button
					type="submit"
					@click="submitUpdateUserRole">
					Click Here
				</button>
			</form>
		</section>
		<hr />
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import type { User } from "#/user"
	import { Role, useUser } from "@/composables/useUser.composable"

	interface Data {
		users: User[]
		userSelected: string
		roles: Role[]
		roleSelected: string
	}

	const token = localStorage.getItem("token")

	export default defineComponent({
		name: "AdminRoleComponent",
		data(): Data {
			return {
				users: [],
				userSelected: "",
				roles: [Role.REGULAR, Role.PRIVILEGED, Role.ADMIN],
				roleSelected: "",
			}
		},
		methods: {
			async submitUpdateUserRole(e: Event) {
				e.preventDefault()
				const email = this.userSelected
				const role = this.roleSelected as Role
				if (!useUser().canUpdateUserRole(token, { email: email, role: role })) {
					alert("You are not allowed to update this user's role")
					return
				} else {
					const result = await useUser().updateRole(token as string, { email: email, role: role })
					if (result.valid) {
						alert("Role updated")
						await this.refreshUsers(token as string)
					} else {
						alert(result.error)
					}
				}
			},
			async refreshUsers(token: string) {
				const result = await useUser().getAllUsers(token)
				result ? (this.users = result) : alert("Error while fetching users")
			},
		},
		async mounted() {
			await this.refreshUsers(token as string)
		},
	})
</script>

<style lang="scss" scoped>
	.admin-role {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		section {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			form {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				label {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					span {
						margin-bottom: 0.5rem;
					}

					select {
						margin-bottom: 1rem;
					}
				}
			}
		}
	}
</style>
