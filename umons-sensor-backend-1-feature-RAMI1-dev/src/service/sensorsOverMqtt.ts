class SensorOverMqtt {
  private _id: string;
  private _name: string;
  private _topic: string;

  constructor(id: string, name: string, topic: string) {
    this._id = id;
    this._name = name;
    this._topic = topic;
  }

  // Getters & Setters
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get topic(): string {
    return this._topic;
  }

  set topic(value: string) {
    this._topic = value;
  }
}

export default SensorOverMqtt;
