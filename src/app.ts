import { exit } from "process";

const RedisSMQ = require("rsmq");

/**
 * @author Alberto Ielpo
 */
export class App {
    constructor() { }

    private rsmq: any = null;

    public init(config: { host: string, port: number, ns: string }) {
        this.rsmq = new RedisSMQ({
            host: config.host,
            port: config.port,
            ns: config.ns
        });
    }

    /**
     * 
     * @returns 
     */
    public async listQueues(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.rsmq.listQueues(function (err, queues) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(queues);
            });
        });
    }

    /**
     * 
     * @param qname 
     * @returns 
     */
    public async getQueueAttributes(qname: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.rsmq.getQueueAttributes({ qname: qname }, function (err, resp) {
                if (err) {
                    console.error(err);
                    reject(err);
                }

                // console.log("==============================================");
                // console.log("=================Queue Stats==================");
                // console.log("==============================================");
                // console.log("visibility timeout: ", resp.vt);
                // console.log("delay for new messages: ", resp.delay);
                // console.log("max size in bytes: ", resp.maxsize);
                // console.log("total received messages: ", resp.totalrecv);
                // console.log("total sent messages: ", resp.totalsent);
                // console.log("created: ", resp.created);
                // console.log("last modified: ", resp.modified);
                // console.log("current n of messages: ", resp.msgs);
                // console.log("hidden messages: ", resp.hiddenmsgs);

                resolve(resp);
            });
        });
    }

    public async sendMessage(qname: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.rsmq.sendMessage({ qname: qname, message: JSON.stringify(payload) },
                function (err, resp) {
                    if (err) {
                        console.error(err)
                        reject(err);
                    }

                    console.log("Message sent. ID:", resp);
                    resolve(resp);
                });
        });
    }

    /**
     * exec the program
     */
    public async exec(config: any, queue: string, payload: any) {
        try {
            this.init(config);
            const listQueues: string[] = await this.listQueues();
            console.log(listQueues);
            if (Array.isArray(listQueues) && listQueues.indexOf(queue) != -1) {
                await this.sendMessage(queue, payload);
                console.log("end...");
            } else {
                console.error("queue not found!");
            }
        } catch (error) {
            console.error(error);
        }

        exit(); //kill the thread
    }
}