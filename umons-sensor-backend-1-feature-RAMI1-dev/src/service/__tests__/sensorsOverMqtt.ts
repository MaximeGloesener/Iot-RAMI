import SensorOverMqtt from "@/service/sensorsOverMqtt";

describe("SensorOverMqtt", () => {
  let sensor: SensorOverMqtt;

  beforeEach(() => {
    sensor = new SensorOverMqtt(
      "1",
      "Temperature Sensor",
      "sensor/temperature"
    );
  });

  it("should create an instance of SensorOverMqtt", () => {
    expect(sensor).toBeInstanceOf(SensorOverMqtt);
  });

  it("should get the id", () => {
    expect(sensor.id).toBe("1");
  });

  it("should set the id", () => {
    sensor.id = "2";
    expect(sensor.id).toBe("2");
  });

  it("should get the name", () => {
    expect(sensor.name).toBe("Temperature Sensor");
  });

  it("should set the name", () => {
    sensor.name = "Humidity Sensor";
    expect(sensor.name).toBe("Humidity Sensor");
  });

  it("should get the topic", () => {
    expect(sensor.topic).toBe("sensor/temperature");
  });

  it("should set the topic", () => {
    sensor.topic = "sensor/humidity";
    expect(sensor.topic).toBe("sensor/humidity");
  });
});
