from constants import MqttAppConstants
from mode.mode import Mode

class ServerMode(Mode):
    
    def run(self):
        self.mqtt_service.subscribe_topic(self.topic_for_hearing_from_sensor) # As the servor, I want to listen to my sensor, sub here
        print("Server mode activated.")
        self.mqtt_service.client.loop_start()

        while True:
            command = input("Enter command among: {}\n".format(MqttAppConstants.get_commands())).strip().lower()
            if command in MqttAppConstants.get_commands():
                self.publish_message_according_to_mode(self.topic_for_hearing_from_server, command) # speak on the another one, always send commands
            else:
                print("Invalid command.")

    def publish_message_according_to_mode(self, topic, command):
        self.publish_message(topic, MqttAppConstants.MSG_CMD, command)
