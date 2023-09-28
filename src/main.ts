import { exit } from "node:process";
import { RedisSMQApp } from "./redisSMQApp";

const dispatcher = new RedisSMQApp();

/**
 * start the program
 */
(async () => {
    const config = {
        host: "127.0.0.1",
        port: 6379,
        ns: "{rsmq}"
    };

    const queue = "QUEUE-NAME";
    const payload = {};

    await dispatcher.exec(config, queue, payload);

    exit(); //kill the thread
})();
