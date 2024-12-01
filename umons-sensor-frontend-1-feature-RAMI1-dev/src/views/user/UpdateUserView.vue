<template>
	<div class="update-information-view">
		<div class="toggle-container">
			<label class="switch">
				<input
					type="checkbox"
					v-model="changePasswordVisible" />
				<span class="slider round"></span>
			</label>
			<span class="toggle-label">{{ changePasswordVisible ? "Do not change" : "Change" }} your password</span>
		</div>

		<FormView
			title="Update Your Information"
			:formFields="filteredFormFields"
			submitButtonText="Update"
			formName="userUpdate"
			sectionText="Need to go back to your account?"
			sectionLink="/home"
			sectionLinkText="Back to account" />
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, computed } from "vue"
	import { UserFields, Sex } from "#/user"
	import FormView from "@/components/user/Form.vue"
	import FormBuilder from "@/helpers/FormBuilder"

	export default defineComponent({
		name: "UpdateInformationView",
		components: {
			FormView,
		},
		setup() {
			const changePasswordVisible = ref(false)

			const formFields = new FormBuilder()
				.addTextField(UserFields.FIRST_NAME, "First Name", "Enter your first name", localStorage.getItem(UserFields.FIRST_NAME) || "")
				.addTextField(UserFields.LAST_NAME, "Last Name", "Enter your last name", localStorage.getItem(UserFields.LAST_NAME) || "")
				.addDateField(UserFields.DATE_OF_BIRTH, "Date of Birth", "Date of Birth", localStorage.getItem(UserFields.DATE_OF_BIRTH) || "", true)
				.addSelectField(
					UserFields.SEX,
					"Sex",
					[
						{ value: Sex.MALE, label: "Male" },
						{ value: Sex.FEMALE, label: "Female" },
						{ value: Sex.OTHER, label: "Other" },
						{ value: Sex.NOTSPECIFY, label: "Not Specified" },
					],
					localStorage.getItem(UserFields.SEX) || ""
				)
				.addTextField(UserFields.ROLE, "Role", "Your role", localStorage.getItem(UserFields.ROLE) || "", true)
				.addTextField(UserFields.EMAIL, "Email", "Enter your email", localStorage.getItem(UserFields.EMAIL) || "")
				.addPasswordField(UserFields.PASSWORD, "Password", "Enter your current password")
				.addPasswordField(UserFields.NEW_PASSWORD, "New Password", "Enter your new password")
				.addPasswordField(UserFields.CONFIRM_NEW_PASSWORD, "Confirm Password", "Confirm your new password")
				.build()

			const filteredFormFields = computed(() => {
				if (changePasswordVisible.value) {
					return formFields
				} else {
					return formFields.filter(field => field.name !== UserFields.NEW_PASSWORD && field.name !== UserFields.CONFIRM_NEW_PASSWORD)
				}
			})

			function toggleChangePassword() {
				changePasswordVisible.value = !changePasswordVisible.value
			}

			return {
				formFields,
				filteredFormFields,
				changePasswordVisible,
				toggleChangePassword,
			}
		},
	})
</script>

<style scoped>
	.update-information-view {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.toggle-container {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}

	.toggle-container .switch {
		margin-right: 0.5rem;
	}

	.toggle-container .toggle-label {
		font-size: 1rem;
	}
</style>
