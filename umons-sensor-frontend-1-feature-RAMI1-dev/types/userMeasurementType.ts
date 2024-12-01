enum Status {
	PENDING = "pending",
	ACCEPTED = "accepted",
	REJECTED = "rejected",
}

interface UserMeasurementTypeRequest {
	id: string
	status: Status
	User: {
		email: string
	}
	measurementType: string
	createdAt: string
}

interface UserMeasurementTypeUpdateResponse {
	message: string
}

export type { UserMeasurementTypeRequest, UserMeasurementTypeUpdateResponse }
export { Status }
