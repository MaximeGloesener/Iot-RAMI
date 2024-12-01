<template>
	<div class="view-title">
		<div>
			<h1>{{ title }}</h1>
			<p v-if="role">Role: {{ role }}</p>
		</div>
		<hr />
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"

	export default defineComponent({
		name: "ViewTitle",
		props: {
			title: String,
			role: String,
		},
	})
</script>

<style lang="scss" scoped>
	.view-title div {
		text-align: center;
		margin: 2vh 0;
	}
</style>
