import { Request, Response } from "express";
import logger from "../logger";
import RabbitMQConfig from "../config/config";


const sendMessageToRabbitmq = async (request: Request, response: Response) => {
    try {
        logger.info(request.body)
        const { message } = request.body;
        const queue = 'my-queue';
        const rabbitmqConf = new RabbitMQConfig();
        // open connection to RabbitMQ
        await rabbitmqConf.connect();
        // send message to publish
        await rabbitmqConf.createQueue(queue);
        await rabbitmqConf.publishToQueue(queue, message);
        //close connection 
        await rabbitmqConf.closeConnection();
        response.status(200).json({ statusText: "Ok!", message: "Message sent to RabbitMQ successfully." });
    } catch (error: any) {
        response.status(500).json({ message: "An error occurred while sending message to RabbitMQ." });
        logger.error("An error occurred while sending message to RabbitMQ", error);
    }
}

const controllers = { sendMessageToRabbitmq };

export default controllers;