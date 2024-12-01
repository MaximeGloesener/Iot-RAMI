import type { UserSensorAccess, UserSensorAccessUpdateResponse, UserSensorRequest, UserSensorRequestUpdateResponse } from "#/userSensor"
import { useAxios } from "@/composables/useAxios.composable"
import { useUserSensorOrMeasurementTypeStore } from "@/stores/userSensorOrMeasurementType"
import type { UserMeasurementTypeRequest, UserMeasurementTypeUpdateResponse } from "#/userMeasurementType"

const useUserSensorOrMeasurementType = () => {
	const { axios } = useAxios()
	const handleErrors = (e: any) => {
		const { message, status } = e.response.data
		const messageClean = "Error " + status + " - " + message
		return { data: null, error: messageClean }
	}
	const getAllUserSensorAccess = async () => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = (await axios.get<UserSensorAccess[]>("/users/sensors/access?number=1000", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})) as { data: UserSensorAccess[] }
			return { data, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const getAllUserSensorRequest = async () => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = (await axios.get<UserSensorRequest[]>("/users/sensors/creation?number=1000", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})) as { data: UserSensorRequest[] }
			return { data, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const updateUserSensorAccess = async (user: string, sensor: string, banned: string) => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = await axios.post<UserSensorAccessUpdateResponse>(
				"/users/sensors/access",
				{
					userName: user,
					sensorName: sensor,
					banned: banned,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			await useUserSensorOrMeasurementTypeStore().refresh()
			return { data: data.message, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const updateUserSensorRequest = async (user: string, sensor: string, banned: string) => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = await axios.post<UserSensorRequestUpdateResponse>(
				"/users/sensors/creation",
				{
					userName: user,
					sensorName: sensor,
					banned: banned,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			await useUserSensorOrMeasurementTypeStore().refresh()
			return { data: data.message, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const createUserSensorAccess = async (user: string, sensor: string) => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = await axios.post<UserSensorAccessUpdateResponse>(
				"/users/sensors/access/ask",
				{
					user: user,
					sensor: sensor,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return { data: data.message, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const createUserSensorRequest = async (user: string, sensor: string) => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = await axios.post<UserSensorRequestUpdateResponse>(
				"/users/sensors/creation/ask",
				{
					user: user,
					sensor: sensor,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return { data: data.message, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const getAllUserMeasurementTypeRequest = async () => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = (await axios.get<UserMeasurementTypeRequest[]>("/users/measurementTypes/creation?number=1000", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})) as { data: UserMeasurementTypeRequest[] }
			return { data, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const updateUserMeasurementTypeRequest = async (user: string, type: string, banned: string) => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = await axios.post<UserMeasurementTypeUpdateResponse>(
				"/users/measurementTypes/creation",
				{
					userName: user,
					type: type,
					banned: banned,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			await useUserSensorOrMeasurementTypeStore().refresh()
			return { data: data.message, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const createUserMeasurementTypeRequest = async (user: string, type: string) => {
		const token = localStorage.getItem("token")
		if (token === null) return { data: null, error: { message: "No token" } }

		try {
			const { data } = await axios.post<UserMeasurementTypeUpdateResponse>(
				"/users/measurementTypes/creation/ask",
				{
					user: user,
					type: type,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return { data: data.message, error: null }
		} catch (e) {
			return handleErrors(e)
		}
	}

	const submitForm = async (user: string, sensor: string, submitFunction: string) => {
		switch (submitFunction) {
			case "sensor.access":
				return await createUserSensorAccess(user, sensor)
			case "sensor.request":
				return await createUserSensorRequest(user, sensor)
			case "measurementType.request":
				return await createUserMeasurementTypeRequest(user, sensor)
			default:
				return { data: null, error: { message: "No function" } }
		}
	}
	return {
		getAllUserSensorAccess,
		updateUserSensorAccess,
		createUserSensorAccess,
		getAllUserSensorRequest,
		updateUserSensorRequest,
		createUserSensorRequest,
		submitForm,
		getAllUserMeasurementTypeRequest,
		updateUserMeasurementTypeRequest,
		createUserMeasurementTypeRequest,
	}
}

export default useUserSensorOrMeasurementType
