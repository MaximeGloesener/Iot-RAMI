import sys
from brokerInformator import BrokerInformator
from resultReporter import ResultReporter
from mqttConnector import MqttConnector
from constants import MqttAppConstants
from mode.sensorMode import SensorMode
from mode.serverMode import ServerMode
from mode.clientMode import WebClientModeOverHivemq

class MqttCliApp:

    @staticmethod
    def print_usage():
        # Print usage instructions for the program.
        print("""Voici ce que fait ce programme:
              1) Simuler un capteur
              2) Simuler un serveur
              3) Simuler les deux
              4) Dans une moindre mesure simuler un client sur websockets over mqtt""")
        print("\n===> Utilisation dans le terminal: ./run_mqttCliApp.sh [mode] [broker] <===")
        print("|=> [mode]: {}".format(MqttAppConstants.get_modes()))
        print("|=> [broker]: {}".format(MqttAppConstants.get_brokers()))

    @staticmethod
    # Get user-provided mode and broker from command line arguments.
    def get_user_mode_and_broker():
        if len(sys.argv) < 3:
            MqttCliApp.print_usage()
            sys.exit(5)
        mode = sys.argv[1]
        specified_broker = sys.argv[2]
        return mode, specified_broker

    @staticmethod
    # Set up the MQTT service based on the specified broker.
    def setup_mqtt_service(specified_broker):
        broker_info = BrokerInformator.get_broker(specified_broker)
        mqtt_service = MqttConnector(broker_info)
        mqtt_service.connect_broker()
        return mqtt_service

    @staticmethod
    def start():
        # Main method to start the application.
        try:
            mode, specified_broker = MqttCliApp.get_user_mode_and_broker()
            mqtt_service = MqttCliApp.setup_mqtt_service(specified_broker)
            current_user_mode = None

            # Determine the mode and start the corresponding simulation.

            if mode == MqttAppConstants.MODE_SENSOR:
                current_user_mode = SensorMode(mqtt_service)
                current_user_mode.run()
            elif mode == MqttAppConstants.MODE_SERVER:
                current_user_mode = ServerMode(mqtt_service)
                current_user_mode.run()
            elif mode == MqttAppConstants.MODE_WSS_CLIENT_OVER_MQTT:
                # This mode is mainly to test if connection to the broker over WebSockets is fine.
                current_user_mode = WebClientModeOverHivemq(mqtt_service)
                current_user_mode.run()
            else:
                print("Invalid mode. Please use a mode in {}.".format(MqttAppConstants.get_modes()))
                sys.exit(1)

        except KeyboardInterrupt:
            # Handle keyboard interruption and offer to save results.
            save = input("Do you want to save: (y/n) ")
            if save == "y" and current_user_mode:
                ResultReporter.generate_excel(specified_broker, mode, current_user_mode.get_all_times_values_interactions())
            mqtt_service.disconnect_broker()
            print('Interrupted')

if __name__ == "__main__":
    # Entry point of the script.
    MqttCliApp.start()
