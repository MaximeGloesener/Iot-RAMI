import axios from "axios"

const config = {
	baseURL: import.meta.env.VITE_APP_BACK_URL as string,
	// timeout: 60 * 1000, // Timeout
	// withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		return config
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error)
	}
)

// Add a response interceptor
_axios.interceptors.response.use(
	function (response) {
		// Do something with response data
		return response
	},
	function (error) {
		// Do something with response error
		return Promise.reject(error)
	}
)

const useAxios = () => {
	return {
		axios: _axios,
	}
}

export { useAxios }
