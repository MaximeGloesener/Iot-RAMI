import json
import random
import time
from constants import MqttAppConstants
from mode.mode import Mode

class SensorMode(Mode):
    def __init__(self, mqtt_service):
        super().__init__(mqtt_service)
        self.mqtt_service.client.on_message = self.on_message_for_sensor
        # Interaction with user
        number_of_values_per_second = self.ask_for_integer("How many data per second do you want to send: ")
        self.publishing_function_mode = self.ask_for_value_mode()
        # end of interaction with user
        # sensor attribute
        self.time_sleep_beetween_two_values = 1/number_of_values_per_second
        self._allow_to_publish = False

    ### Getter and setter for publishing

    @property
    def allow_to_publish(self):
        return self._allow_to_publish

    @allow_to_publish.setter
    def allow_to_publish(self, value):
        self._allow_to_publish = value

    def ask_for_integer(self, prompt):
        while True:
            try:
                value = int(input(prompt))
                if (value <= 0):
                    raise ValueError
                return value
            except ValueError:
                print("{} is not a valid number.".format(value))

    
    def ask_for_value_mode(self):
        mode = input("Do you want to send ordered values? [y] otherwise random: ").strip().lower()
        if mode == 'y':
            return self.publish_ordered_value
        else:
            return self.publish_random_value


    def run(self):
        self.mqtt_service.subscribe_topic(self.topic_for_hearing_from_server) # As the sensor, I want to listen to my servor, sub here
        print("Sensor mode activated. Waiting for user commands.")
        self.mqtt_service.client.loop_start()
        while True:
            if self.allow_to_publish:
                self.publishing_function_mode(self.topic_for_hearing_from_sensor) #  # speak on the another one (You can also send non ordered value)
    
    def publish_value(self, topic, value):
        self.publish_message(topic, MqttAppConstants.MSG_VALUE, value)

    def publish_answer_to_server_command(self, topic, answer):
        self.publish_message(topic, MqttAppConstants.MSG_ANS, answer)

    def interact_with_received_command(self, message):

        received_message = message.payload.decode()
        received_json = json.loads(received_message)
        received_value = received_json[MqttAppConstants.MSG_CMD] # command received from the server

        if received_value == MqttAppConstants.COMMAND_PING:
            if self.allow_to_publish:
                # the sensor is already publishing
                self.publish_answer_to_server_command(self.topic_for_hearing_from_sensor,MqttAppConstants.PING_RESPONSE_WHEN_ALREADY_PUBLISHING)
    
            else:
                self.publish_answer_to_server_command(self.topic_for_hearing_from_sensor, MqttAppConstants.PING_RESPONSE)
        elif received_value == MqttAppConstants.COMMAND_START:
                self.publish_answer_to_server_command(self.topic_for_hearing_from_sensor, MqttAppConstants.START_RESPONSE)
                self.allow_to_publish = True
                # We set allow_to_publish to True after answering to the server, because otherwise we would start sending values
                # before answering to the server command (the sensor would start publishing whenever the attribute is True)
        elif received_value == MqttAppConstants.COMMAND_STOP:
            self.allow_to_publish = False
            self.publish_answer_to_server_command(self.topic_for_hearing_from_sensor, MqttAppConstants.STOP_RESPONSE)

    def on_message_for_sensor(self, client, userdata, message):
        super().on_message_for_mode
        self.interact_with_received_command(message)


    def publish_random_value(self, topic):
        while True:
            if self.allow_to_publish:
                value = random.randint(1, 100)
                self.publish_value(topic, value)
            time.sleep(self.time_sleep_beetween_two_values)


    def publish_ordered_value(self, topic):
        value = 1
        while True:
            if self.allow_to_publish:
                self.publish_value(topic, value)
                value += 1
            time.sleep(self.time_sleep_beetween_two_values)
