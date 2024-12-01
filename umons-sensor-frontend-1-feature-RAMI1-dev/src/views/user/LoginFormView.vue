<template>
	<div>
		<FormVue
			title="Login"
			:formFields="formFields"
			submitButtonText="Login"
			formName="login"
			sectionLink="/signup"
			sectionLinkText="Create your account"
			sectionText="Don't have an account?" />
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import { UserFields } from "#/user"
	import type { FormField } from "@/helpers/FormBuilder"
	import FormVue from "@/components/user/Form.vue"
	import FormBuilder from "@/helpers/FormBuilder"

	export default defineComponent({
		name: "LoginFormView",
		components: {
			FormVue,
		},
		data() {
			return {
				formFields: [] as FormField[],
			}
		},
		created() {
			this.formFields = new FormBuilder().addTextField(UserFields.EMAIL, "Email", "Enter your email").addPasswordField(UserFields.PASSWORD, "Password", "Enter your password").build()
		},
	})
</script>

<style scoped>
	/* Add any styles specific to the login form here */
</style>
