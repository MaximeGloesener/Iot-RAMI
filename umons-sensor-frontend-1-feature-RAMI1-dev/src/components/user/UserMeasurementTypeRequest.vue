<template>
	<div class="user-measurement-type-request">
		<UserForm
			submitFunction="measurementType.request"
			title="Ask for measurement type creation" />
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import UserForm from "@/components/user/UserForm.vue"

	export default defineComponent({
		name: "UserMeasurementTypeRequest",
		components: {
			UserForm,
		},
	})
</script>

<style lang="scss" scoped></style>
