<script lang="ts">
	import { defineComponent } from "vue"

	export default defineComponent({
		name: "OptionSelector",
		props: {
			message: {
				type: String,
				required: true,
			},
			list: {
				type: Array,
				required: true,
			},
		},
		data() {
			return {
				optionSelected: "",
			}
		},
		methods: {
			getOptionKey(option: unknown): string {
				if (typeof option === "string") {
					return option
				}
				return ""
			},
		},
		watch: {
			async optionSelected() {
				this.$emit("option-selected-change", this.optionSelected, this.message)
			},
		},
	})
</script>

<template>
	<div class="option-selector">
		<form>
			<span>{{ message }} :</span>
			<select v-model="optionSelected">
				<option
					disabled
					value="">
					Please select one
				</option>
				<option
					v-for="option in list"
					:key="getOptionKey(option)">
					{{ option }}
				</option>
			</select>
		</form>
	</div>
</template>

<style lang="scss" scoped>
	span {
		font-weight: bold;
		color: var(--color-secondary);
	}
</style>
