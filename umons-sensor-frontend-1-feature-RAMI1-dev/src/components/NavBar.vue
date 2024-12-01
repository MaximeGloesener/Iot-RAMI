<template>
	<aside class="sidebar">
		<div class="sidebar-header">
			<h2>RAMI</h2>
		</div>
		<nav class="sidebar-nav">
			<ul>
				<li
					v-for="(item, index) in items"
					:key="index">
					<router-link
						:class="[isActive(item.path) ? 'active-link' : '']"
						:to="item.path">
						{{ item.name }}
					</router-link>
				</li>
			</ul>
		</nav>
		<div class="sidebar-footer">
			<button
				class="logout-button"
				@click="logout">
				Log out
			</button>
		</div>
	</aside>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue"
	import { useUser } from "@/composables/useUser.composable"

	const { cleanUserLocalStorage } = useUser()

	interface DataComponent {
		items: MenuItem[]
	}

	interface MenuItem {
		path: string
		name: string
	}

	export default defineComponent({
		name: "NavBar",
		data(): DataComponent {
			return {
				items: reactive<MenuItem[]>([
					{ path: "/home", name: "Dashboard" },
					{ path: "/user", name: "User" },
					{ path: "/user/update", name: "Update your profile" },
					{ path: "/session/new", name: "New session" },
					{ path: "/admin", name: "Admin" },
					{ path: "/users/all", name: "All users" },
					{ path: "/sensors", name: "All sensors" },
				]),
			}
		},
		methods: {
			isActive(path: string): boolean {
				return this.$route.path === path
			},
			logout() {
				cleanUserLocalStorage()
				alert("You have been logged out")
				location.href = "/"
			},
		},
	})
</script>

<style scoped>
	.sidebar {
		width: 250px;
		background-color: #f8f9fa;
		border-right: 1px solid #dee2e6;
		padding: 20px;
		box-sizing: border-box;
	}

	.sidebar-header {
		margin-bottom: 20px;
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.sidebar-nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.sidebar-nav ul li {
		margin-bottom: 10px;
	}

	.sidebar-nav ul li a {
		text-decoration: none;
		color: #000;
		display: block;
		padding: 5px 0;
	}

	.sidebar-nav ul li a:hover {
		background-color: #ffffff;
	}

	.sidebar-nav ul li a.active-link {
		background-color: #ffffff;
		font-weight: bold;
	}

	.sidebar-footer {
		margin-top: 20px;
	}

	.logout-button {
		width: 100%;
		padding: 10px;
		background-color: #e0e0e0;
		border: none;
		cursor: pointer;
	}

	.logout-button:hover {
		background-color: #d4d4d4;
	}
</style>
