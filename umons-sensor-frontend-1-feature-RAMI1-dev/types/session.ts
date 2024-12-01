enum SessionFields {
	ID = "id",
	ID_USER = "idUser",
	ID_SENSOR = "idSensor",
	TOPIC = "topic",
	CREATED_AT = "createdAt",
	ENDED_AT = "endedAt",
}

interface Session {
	[SessionFields.ID]: string
	[SessionFields.ID_USER]: string
	[SessionFields.ID_SENSOR]: string
	[SessionFields.TOPIC]: string
	[SessionFields.CREATED_AT]: string
	[SessionFields.ENDED_AT]?: string // Optional as the session might be ongoing
}

// Controller Path

// Pair of requests/responses (You need to do this for each controller path acessible from the frontend)
interface CreateClientSideSessionRequestBody {
	[SessionFields.ID_USER]: string
	[SessionFields.ID_SENSOR]: string
}

interface CreateSessionOnServerRequestBody extends CreateClientSideSessionRequestBody {
	[SessionFields.CREATED_AT]: string
	[SessionFields.ENDED_AT]: string
}

// Answer format
interface MqttCredentials {
	url: string
	username: string
	password: string
	topic: string
}

interface CreateServorSessionResponse {
	message: string
}

export type { Session, CreateClientSideSessionRequestBody, CreateSessionOnServerRequestBody, MqttCredentials, CreateServorSessionResponse }
