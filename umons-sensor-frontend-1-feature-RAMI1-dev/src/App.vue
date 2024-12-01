<script lang="ts" setup>
	import { RouterView } from "vue-router"
	import NavBar from "@/components/NavBar.vue"
</script>

<template>
	<div class="app-container">
		<NavBar />
		<main class="content">
			<RouterView />
		</main>
	</div>
</template>

<style lang="scss">
	.app-container {
		display: flex;
		height: 100vh;
	}

	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
	}
</style>
