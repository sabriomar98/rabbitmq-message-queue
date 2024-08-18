import { createLogger, format, transports } from 'winston';

// Configure the logger
const logger = createLogger({
    level: 'info', // Set the default logging level
    format: format.combine(
        format.colorize({ colors: { info: 'blue', error: 'red' }, level: true }), // Colorize the output
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamps
        format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
        new transports.File({ filename: 'logs/combined.log' }) // Log all messages to a combined log file
    ],
});

// Export the logger to use it in other parts of the application
export default logger;
