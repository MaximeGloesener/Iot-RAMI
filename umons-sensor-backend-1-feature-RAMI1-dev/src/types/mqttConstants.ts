type BrokerInfo = {
  url: string;
  port: number;
  username: string;
  password: string;
};

type Topics = {
  HEARING_THE_SENSOR: string;
  HEARING_THE_SERVER: string;
};

type Commands = {
  PING: string;
  START: string;
  STOP: string;
};

type Responses = {
  PONG: string;
  PONG_PUBLISHING: string;
  START_PUBLISHING: string;
  STOP_PUBLISHING: string;
};

type MessageFields = {
  TIMESTAMP: string;
  CMD: string;
  ANS: string;
  VALUE: string;
};

export type { BrokerInfo, Topics, Commands, Responses, MessageFields };
