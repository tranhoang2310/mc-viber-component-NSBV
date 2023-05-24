const { createLogger, format, transports } = require('winston');
const path = require('path'); 

module.exports = createLogger({
    transports: [
        new transports.File({
            filename: 'logs/server.log',
            format:format.combine( 
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`
            ),
        )}),
        new transports.Console()
    ]
});