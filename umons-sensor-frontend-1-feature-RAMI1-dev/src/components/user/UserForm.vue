<template>
	<div class="user-form">
		<section>
			<h2>{{ title }}</h2>
			<form>
				<label for="email">Email</label>
				<input
					id="email"
					v-model="formData.email"
					required
					type="email" />
				<label for="item">Item</label>
				<input
					id="item"
					v-model="formData.item"
					required
					type="text" />
				<label for="keepEmail">Keep email</label>
				<input
					v-model="formData.keepEmail"
					type="checkbox" />
				<button @click="submitForm">Submit</button>
			</form>
		</section>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import useUserSensorOrMeasurementType from "@/composables/useUserSensorOrMeasurementType.composable"

	export default defineComponent({
		name: "UserForm",
		props: {
			title: {
				type: String,
				required: true,
			},
			submitFunction: {
				type: String,
				required: true,
			},
		},
		data() {
			return {
				formData: {
					email: "",
					item: "",
					keepEmail: false,
				},
			}
		},
		methods: {
			async submitForm(event: Event) {
				event.preventDefault()

				if (!this.formData.email.trim()) {
					alert("Email is empty")
					return
				} else if (!this.formData.item.trim()) {
					alert("Item is empty")
					return
				} else if (!this.formData.email.includes("@")) {
					alert("Email is not valid")
					return
				}
				const { error } = await useUserSensorOrMeasurementType().submitForm(this.formData.email, this.formData.item, this.submitFunction)
				error ? alert(error) : null
				this.formData.item = error ? this.formData.item : ""
				this.formData.email = this.formData.keepEmail ? this.formData.email : ""
			},
		},
	})
</script>

<style lang="scss" scoped>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	input {
		margin: 0.5rem;
	}

	button {
		margin: 0.5rem;
	}
</style>
