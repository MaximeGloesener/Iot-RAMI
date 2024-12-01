enum Status {
	PENDING = "pending",
	ACCEPTED = "accepted",
	REJECTED = "rejected",
}

interface UserSensorAccess {
	id: string
	status: Status
	User: {
		email: string
	}
	Sensor: {
		name: string
	}
	createdAt: string
}

interface UserSensorRequest {
	id: string
	status: Status
	sensorName: string
	User: {
		email: string
	}
	createdAt: string
}

interface UserSensorAccessUpdateResponse {
	message: string
}

interface UserSensorRequestUpdateResponse {
	message: string
}

export type { UserSensorAccess, UserSensorAccessUpdateResponse, UserSensorRequest, UserSensorRequestUpdateResponse }
export { Status }
