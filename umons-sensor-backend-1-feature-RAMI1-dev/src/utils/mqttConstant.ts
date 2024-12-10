import {
  BrokerInfo,
  Topics,
  Commands,
  Responses,
  MessageFields,
} from "#/mqttConstants";

const BROKER_INFO: BrokerInfo = {
  // You can easily change the broker here, you just have to provide your broker information
  url: "b8ae34f9f9614007847e4a94196aa111.s1.eu.hivemq.cloud", // USE mqtts = mqtt + tls
  port: 8883,
  username: "sensorsOverHiveMQ",
  password: "KUvhSswNgi..7w4",
};

const TOPICS: Topics = {
  HEARING_THE_SENSOR: "/sensor",
  HEARING_THE_SERVER: "/server",
};

const COMMANDS: Commands = {
  PING: "ping",
  START: "start",
  STOP: "stop",
};

const RESPONSES: Responses = {
  PONG: "pong",
  PONG_PUBLISHING: "pong.publishing",
  START_PUBLISHING: "start.publishing",
  STOP_PUBLISHING: "stop.publishing",
};

const MESSAGE_FIELDS: MessageFields = {
  TIMESTAMP: "timestamp",
  CMD: "cmd",
  ANS: "ans",
  VALUE: "value",
};

export { BROKER_INFO, TOPICS, COMMANDS, RESPONSES, MESSAGE_FIELDS };
