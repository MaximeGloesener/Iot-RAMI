<template>
	<div class="user-view">
		<ViewTitle :title="viewTitle" />
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
	import AdminRoleComponent from "@/components/AdminRole.vue"
	import AdminSensorRequest from "@/components/AdminSensorRequest.vue"
	import ViewTitle from "@/components/ViewTitle.vue"
	import AdminSensorAccess from "@/components/AdminSensorAccess.vue"
	import AdminMeasurementTypeRequest from "@/components/AdminMeasurementTypeRequest.vue"

	export default defineComponent({
		name: "AdminView",
		components: {
			ViewTitle,
			ComponentSelector,
			AdminSensorRequest,
			AdminSensorAccess,
			AdminRoleComponent,
			AdminMeasurementTypeRequest,
		},
		data() {
			return {
				viewTitle: "Admin",
				componentId: "admin-component-select",
				selectedComponent: "none",
				components: [
					{ name: "AdminRoleComponent", label: "Modify role" },
					{ name: "AdminSensorAccess", label: "Sensor access" },
					{ name: "AdminSensorRequest", label: "Sensor creation" },
					{ name: "AdminMeasurementTypeRequest", label: "Measurement type creation" },
				],
			}
		},
		methods: {
			updateSelectedComponent(component: string) {
				this.selectedComponent = component
			},
		},
	})
</script>

<style lang="scss" scoped></style>
