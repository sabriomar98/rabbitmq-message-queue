import express, { NextFunction, Request, Response } from 'express';
import logger from './logger';
import bodyParser from 'body-parser';
import rabbitmqRouter from './routes/route';
import dotenv from "dotenv";

// Load environment variables from.env file
dotenv.config();

// Initialize the Express application
const app = express();
const jsonParser = bodyParser.json();

// Middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

// Define a simple route
app.get('/', (req: Request, res: Response) => {
    logger.info('Root route accessed');
    res.send('Hello, World!');
});

app.use("/send-message", jsonParser, rabbitmqRouter)
// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
});
