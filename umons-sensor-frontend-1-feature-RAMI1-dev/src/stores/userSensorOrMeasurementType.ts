import { ref } from "vue"
import { defineStore } from "pinia"
import useUserSensorOrMeasurementType from "@/composables/useUserSensorOrMeasurementType.composable"
import type { UserSensorAccess, UserSensorRequest } from "#/userSensor"
import type { UserMeasurementTypeRequest } from "#/userMeasurementType"

export const useUserSensorOrMeasurementTypeStore = defineStore("userSensor", () => {
	const userSensorAccess = ref<UserSensorAccess[]>([])
	const userSensorRequest = ref<UserSensorRequest[]>([])
	const userMeasurementTypeRequest = ref<UserMeasurementTypeRequest[]>([])

	const getUserSensorAccess = () => {
		return userSensorAccess.value
	}

	const getUserSensorRequest = () => {
		return userSensorRequest.value
	}

	const getUserMeasurementTypeRequest = () => {
		return userMeasurementTypeRequest.value
	}
	const refresh = async () => {
		const res = await useUserSensorOrMeasurementType().getAllUserSensorAccess()
		userSensorAccess.value = res.data!
		const res2 = await useUserSensorOrMeasurementType().getAllUserSensorRequest()
		userSensorRequest.value = res2.data!
		const res3 = await useUserSensorOrMeasurementType().getAllUserMeasurementTypeRequest()
		userMeasurementTypeRequest.value = res3.data!
	}
	return { getUserSensorAccess, getUserSensorRequest, getUserMeasurementTypeRequest, refresh }
})
