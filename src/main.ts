/**
 * start the program
 */
const app = require('./app');
const dispatcher = new app.App();

const config = {
    host: "127.0.0.1",
    port: 6379,
    ns: "{rsmq}"
}

const queue = "QUEUE-NAME";
const payload = {};

dispatcher.exec(config, queue, payload);