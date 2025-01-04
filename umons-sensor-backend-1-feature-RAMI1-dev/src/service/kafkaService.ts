import { Kafka, Producer, Consumer } from 'kafkajs';

class KafkaService {
  private static instance: KafkaService;
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  private constructor() {
    console.log('🚀 Initializing Kafka Service...');
    this.connectToKafka();
  }

  public static async getInstance(): Promise<KafkaService> {
    if (!KafkaService.instance) {
      console.log('📦 Creating new Kafka Service instance');
      KafkaService.instance = new KafkaService();
      await KafkaService.instance.connect();
    }
    return KafkaService.instance;
  }

  private async connectToKafka(): Promise<void> {
    try {
      console.log('🔄 [Kafka] Tentative de connexion...');
      
      this.kafka = new Kafka({
        clientId: 'sensor-app',
        brokers: ['kafka:9092'],
        retry: {
          initialRetryTime: 100,
          retries: 5
        }
      });

      this.producer = this.kafka.producer();
      await this.producer.connect();
      
      console.log('✅ [Kafka] Connexion établie');
    } catch (error) {
      console.error('❌ [Kafka] Erreur de connexion:', error);
      throw error;
    }
  }

  private async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log('✅ Kafka Producer connected successfully');
      
      await this.consumer.connect();
      console.log('✅ Kafka Consumer connected successfully');
    } catch (error) {
      console.error('❌ Error connecting to Kafka:', error);
      throw error;
    }
  }

  public async publishSensorData(topic: string, data: any): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(data) }],
      });
      console.log('📤 Published to Kafka:', {
        topic,
        data
      });
    } catch (error) {
      console.error('❌ Error publishing to Kafka:', error);
      throw error;
    }
  }

  public async subscribeTopic(topic: string, callback: (data: any) => void): Promise<void> {
    try {
      await this.consumer.subscribe({ topic });
      console.log('📥 Subscribed to Kafka topic:', topic);

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const data = JSON.parse(message.value?.toString() || '');
          console.log('📨 Received Kafka message:', {
            topic,
            partition,
            data
          });
          callback(data);
        },
      });
    } catch (error) {
      console.error('❌ Error subscribing to Kafka topic:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log('👋 Kafka Producer disconnected');
      
      await this.consumer.disconnect();
      console.log('👋 Kafka Consumer disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting from Kafka:', error);
      throw error;
    }
  }
}

export default KafkaService;