from constants import MqttAppConstants

# BrokerInformator class provides connection information for different MQTT brokers.
class BrokerInformator:

    @staticmethod
    def get_broker(broker_name):
        # Returns broker information based on the provided broker name.
        if broker_name == MqttAppConstants.LOCAL:
            return BrokerInformator.local()
        elif broker_name == MqttAppConstants.MOSQUITTO:
            return BrokerInformator.mosquitto_org()
        elif broker_name == MqttAppConstants.HIVEMQ:
            return BrokerInformator.hivemq()
        elif broker_name == MqttAppConstants.MARTIN_HIVEMQ:
            return BrokerInformator.martin_hivemq()
        elif broker_name == MqttAppConstants.WEBSOCKET_HIVEMQ:
            # Here, the hivemq version allow us to do websocket over mqtt.
            return BrokerInformator.websocket_client_over_hivemq()
        else:
            raise ValueError("Invalid broker name")
        
    # Each broker method must return a dictionary with the same fields:
    # "url", "port", "username", "password", "tls" and "ws".

    @staticmethod
    def local():
        return {
            "url": "localhost",
            "port": 1883,
            "username": "test",
            "password": "test",
            "tls": False,
            "ws": False
        }

    @staticmethod
    def mosquitto_org():
        return {
            "url": "test.mosquitto.org",
            "port": 1883,
            "username": None,
            "password": None,
            "tls": False,
            "ws": False
        }

    @staticmethod
    def hivemq():
        # Do not forget about the secure version (tls)
        return {
            "url": "b8ae34f9f9614007847e4a94196aa111.s1.eu.hivemq.cloud",
            "port": 8883,
            "username": "sensorsOverHiveMQ",
            "password": "KUvhSswNgi..7w4",
            "tls": True,
            "ws": False
        }
    
    
    @staticmethod
    def martin_hivemq():
        # Do not forget about the secure version (tls)  => martin code use "test1"
        return {
            "url": "b5268dbb6e3f4c548fb343bb43412c07.s2.eu.hivemq.cloud",
            "port": 8883,
            "username": "testtest",
            "password": "Test12345",
            "tls": True,
            "ws": False
        }
    
    @staticmethod
    def websocket_client_over_hivemq():
        return {
            "url": "b8ae34f9f9614007847e4a94196aa111.s1.eu.hivemq.cloud",
            "port": 8884,
            "username": "sensorsOverHiveMQ",
            "password": "KUvhSswNgi..7w4",
            "tls": True,
            "ws": True
        }
    

    @staticmethod
    def get_url(broker_info):
        return broker_info["url"]

    @staticmethod
    def get_port(broker_info):
        return broker_info["port"]

    @staticmethod
    def get_username(broker_info):
        return broker_info["username"]

    @staticmethod
    def get_password(broker_info):
        return broker_info["password"]
    
    @staticmethod
    def get_tls(broker_info):
        return broker_info["tls"]
    
    @staticmethod
    def get_ws(broker_info):
        return broker_info["ws"]
