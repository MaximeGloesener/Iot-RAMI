<template>
	<div class="component-selector">
		<form>
			<label :for="id">Select Component:</label>
			<select
				:id="id"
				v-model="selectedComponent">
				<option value="none">None</option>
				<option
					v-for="component in components"
					:key="component.name"
					:value="component.name">
					{{ component.label }}
				</option>
			</select>
		</form>
	</div>
</template>

<script lang="ts">
	import type { PropType } from "vue"
	import { defineComponent } from "vue"

	interface ComponentType {
		name: string
		label: string
	}

	export default defineComponent({
		name: "ComponentSelector",
		props: {
			id: String,
			components: Array as PropType<ComponentType[]>,
		},
		data() {
			return {
				selectedComponent: "none",
			}
		},
		watch: {
			selectedComponent(component: string) {
				this.$emit("update-selected-component", component)
			},
		},
	})
</script>

<style lang="scss" scoped>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	form {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 2vh 0;
	}

	select {
		margin-left: 1rem;
	}
</style>
