import amqp from "amqplib";
import logger from "../logger";

// Define configuration options
const RABBITMQ_HOST = process.env.RABBITMQ_HOST // Update if using Docker Compose
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD

// Define connection URL
const RABBITMQ_URL = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/`;

class RabbitMQConfig {
    channel: amqp.Channel | null;
    constructor() {
        this.channel = null;
    }

    async connect() {
        try {
            const conn = await amqp.connect(RABBITMQ_URL);
            this.channel = await conn.createChannel();
            logger.info(`Connected to RabbitMQ server at ${RABBITMQ_URL}`);
        } catch (error) {
            logger.error("Error connecting to RabbitMQ server", error);
            throw error;
        }
    }

    async createQueue(queueName: string, options?: any) {
        await this.channel?.assertQueue(queueName, options);
    }

    async publishToQueue(queueName: string, message: string) {
        this.channel?.sendToQueue(queueName, Buffer.from(message));
        logger.info(`Message published to queue: ${queueName}, message: ${message}`);
    }

    async subscribeToQueue(queueName: string, callback: (msg: string) => void, options: any) {
        this.channel?.consume(queueName, (msg: amqp.ConsumeMessage | null) => {
            if (msg !== null) {
                const message = msg.content.toString();
                callback(message);
            }
        }, options);
        logger.info(`Consumer started consuming from queue: ${queueName}`);
    }

    async closeConnection() {
        if (this.channel) {
            await this.channel.close();
        }
        logger.info("Connection to RabbitMQ server closed");
    }
}

export default RabbitMQConfig;
