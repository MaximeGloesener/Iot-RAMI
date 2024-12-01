import time
from mode.mode import Mode

class WebClientModeOverHivemq(Mode):

    def publish_message_according_to_mode(self, topic, commandOrValue):
        # This mode does not publish anything
        pass

    def run(self):
        self.mqtt_service.subscribe_topic(self.topic_for_hearing_from_sensor)
        print("ClientModeOverHivemq activated.")
        self.mqtt_service.client.loop_start()

        while True:
            time.sleep(1) 