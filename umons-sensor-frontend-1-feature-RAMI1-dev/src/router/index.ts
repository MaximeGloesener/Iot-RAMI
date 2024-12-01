import { createRouter, createWebHistory } from "vue-router"

import { useUser } from "@/composables/useUser.composable"

const { cleanUserLocalStorage, canAccessAdminPanel } = useUser()

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "login",
			component: () => import("@/views/user/LoginFormView.vue"),
		},
		{
			path: "/home",
			name: "home",
			component: () => import("@/views/user/DashboardView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/admin",
			name: "admin",
			component: () => import("@/views/AdminView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
		/*******	USER	*********/
		{
			path: "/user",
			name: "user",
			component: () => import("@/views/UserView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/user/update",
			name: "userUpdate",
			component: () => import("@/views/user/UpdateUserView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/users/all",
			component: () => import("@/views/user/UsersSessionsView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/signup",
			name: "signup",
			component: () => import("@/views/user/SignupFormView.vue"),
		},
		{
			path: "/sensors",
			name: "sensors",
			component: () => import("@/views/sensor/SensorsView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/session/new",
			name: "newsession",
			component: () => import("@/components/session/RealTimeSession.vue"),
			meta: {
				requiresAuth: true,
			},
		},
	],
})

router.beforeEach(async (to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth) // Check if the route requires authentication
	const token = localStorage.getItem("token")
	const expires_at = localStorage.getItem("expiresAt")

	if (!requiresAuth) {
		// If the route does not require authentication, continue
		return next()
	}

	if (!token || !expires_at) {
		cleanUserLocalStorage()
		alert("You need to login first")
		return next("/")
	}
	if (token && expires_at < Date.now().toString()) {
		// If the token is expired, clean the local storage and redirect to log in
		cleanUserLocalStorage()
		alert("Your session has expired")
		return next("/")
	}
	if (to.name === "admin") {
		const res = await canAccessAdminPanel(token)
		if (!res) {
			alert("You are not allowed to access this page")
			return next("/")
		}
		alert(res.message)
		return res.canAccess ? next() : next("/")
	}
	// If the token is valid, continue
	return next()
})

export default router
