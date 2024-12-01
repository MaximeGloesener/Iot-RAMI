<template>
	<div class="form-container">
		<h1>{{ title }}</h1>
		<form @submit.prevent="handleSubmit">
			<div
				class="input-row"
				v-for="(field, index) in formFields"
				:key="index">
				<label
					:for="field.name"
					class="form-label"
					>{{ field.label }}</label
				>
				<div class="input-field">
					<input
						v-if="isInputField(field.type)"
						v-model="formData[field.name]"
						:name="field.name"
						:type="field.type"
						:id="field.name"
						:placeholder="field.placeholder"
						:readonly="field.readonly"
						class="form-input" />
					<select
						v-if="field.type === 'select'"
						v-model="formData[field.name]"
						:name="field.name"
						:id="field.name"
						class="form-input">
						<option
							v-for="option in field.options"
							:value="option.value"
							:key="option.value">
							{{ option.label }}
						</option>
					</select>
				</div>
				<div
					v-if="errors[field.name]"
					class="error-message">
					{{ errors[field.name] }}
				</div>
				<div
					v-if="field.readonly"
					class="readonly-message">
					You cannot modify this field
				</div>
			</div>
			<div class="input-row">
				<button
					type="submit"
					class="submit-button">
					{{ submitButtonText }}
				</button>
			</div>
		</form>
		<hr />
		<div class="form-section">
			<p>
				{{ sectionText }}
				<router-link :to="sectionLink">{{ sectionLinkText }}</router-link>
			</p>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import { useUser } from "@/composables/useUser.composable"
	import type { FormField } from "@/helpers/FormBuilder"

	export default defineComponent({
		name: "FormView",
		props: {
			title: {
				type: String,
				required: true,
			},
			formFields: {
				type: Array as () => FormField[],
				required: true,
			},
			submitButtonText: {
				type: String,
				required: true,
			},
			formName: {
				type: String,
				required: true,
			},
			sectionText: {
				type: String,
				required: true,
			},
			sectionLink: {
				type: String,
				required: true,
			},
			sectionLinkText: {
				type: String,
				required: true,
			},
		},
		data() {
			return {
				formData: {} as Record<string, string>,
				errors: {} as Record<string, string>,
			}
		},
		created() {
			this.formFields.forEach(field => {
				this.formData[field.name] = field.value || ""
			})
		},
		methods: {
			async handleSubmit() {
				const { validateForm, submitForm } = useUser()
				this.errors = {}

				const userFormValidity = validateForm(this.formData, this.formFields)

				if (!userFormValidity.valid) {
					this.errors = userFormValidity.errors
					return
				}

				const token = localStorage.getItem("token")

				await submitForm(this.formData, this.formName, token)
			},
			isInputField(type: string): type is "text" | "password" | "date" | "email" {
				return ["text", "password", "date", "email"].includes(type)
			},
		},
	})
</script>

<style scoped>
	/* Form Styles */
	.form-container {
		max-width: 700px;
		width: 100%;
		margin: 0 auto;
		padding: 20px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		text-align: center;
		margin-bottom: 20px;
	}

	.input-row {
		margin-bottom: 20px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		font-weight: bold;
		color: #333;
	}

	.input-field {
		position: relative;
	}

	.form-input {
		width: 100%;
		padding: 10px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
		transition: border-color 0.3s;
	}

	.form-input:focus {
		border-color: #007bff;
		outline: none;
	}

	.error-message {
		margin-top: 5px;
		color: red;
		font-size: 14px;
	}

	.readonly-message {
		margin-top: 5px;
		color: gray;
		font-size: 12px;
	}

	.submit-button {
		display: inline-block;
		padding: 10px 20px;
		font-size: 16px;
		color: #fff;
		background-color: #5fcf50;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.submit-button:hover {
		background-color: #45a049;
	}
</style>
