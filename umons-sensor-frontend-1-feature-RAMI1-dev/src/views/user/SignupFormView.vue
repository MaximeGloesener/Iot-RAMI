<template>
	<FormVue
		title="Create an Account"
		:formFields="formFields"
		submitButtonText="Sign Up"
		formName="signup"
		sectionLink="/"
		sectionLinkText="Log in"
		sectionText="Already have an account?" />
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import { UserFields, Sex } from "#/user"
	import type { FormField } from "@/helpers/FormBuilder"
	import FormVue from "@/components/user/Form.vue"
	import FormBuilder from "@/helpers/FormBuilder"

	export default defineComponent({
		name: "SignupFormView",
		components: {
			FormVue,
		},
		data() {
			return {
				formFields: [] as FormField[],
			}
		},
		created() {
			this.formFields = new FormBuilder()
				.addTextField(UserFields.FIRST_NAME, "First Name", "Enter your first name")
				.addTextField(UserFields.LAST_NAME, "Last Name", "Enter your last name")
				.addDateField(UserFields.DATE_OF_BIRTH, "Date of Birth")
				.addSelectField(UserFields.SEX, "Sex", [
					{ value: Sex.MALE, label: "Male" },
					{ value: Sex.FEMALE, label: "Female" },
					{ value: Sex.OTHER, label: "Other" },
					{ value: Sex.NOTSPECIFY, label: "Not Specified" },
				])
				.addTextField(UserFields.EMAIL, "Email", "Enter your email")
				.addPasswordField(UserFields.PASSWORD, "Password", "Enter your password")
				.addPasswordField(UserFields.CONFIRM_PASSWORD, "Confirm Password", "Confirm your password")
				.build()
		},
	})
</script>

<style scoped>
	/* Add any styles specific to the signup form here */
</style>
