<template>
	<div class="user-view">
		<ViewTitle
			:role="role"
			:title="viewTitle" />
		<section>
			<ComponentSelector
				:id="componentId"
				:components="components"
				@update-selected-component="updateSelectedComponent" />
		</section>
		<hr />
		<div>
			<component :is="selectedComponent" />
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import ComponentSelector from "@/components/ComponentSelector.vue"
	import ViewTitle from "@/components/ViewTitle.vue"
	import UserSensorRequest from "@/components/user/UserSensorRequest.vue"
	import UserSensorAccess from "@/components/user/UserSensorAccess.vue"
	import UserMeasurementTypeRequest from "@/components/user/UserMeasurementTypeRequest.vue"

	export default defineComponent({
		name: "UserView",
		components: { ViewTitle, ComponentSelector, UserSensorRequest, UserSensorAccess, UserMeasurementTypeRequest },
		data() {
			return {
				viewTitle: "User",
				componentId: "user-component-select",
				selectedComponent: "none",
				components: [
					{ name: "UserSensorAccess", label: "Access a sensor" },
					{ name: "UserSensorRequest", label: "Create a sensor" },
					{ name: "UserMeasurementTypeRequest", label: "Create a measurement type" },
				],
				role: "n/a",
			}
		},
		methods: {
			updateSelectedComponent(component: string) {
				this.selectedComponent = component
			},
		},
		mounted() {
			this.role = localStorage.getItem("role") || "n/a"
		},
	})
</script>

<style lang="scss" scoped></style>
