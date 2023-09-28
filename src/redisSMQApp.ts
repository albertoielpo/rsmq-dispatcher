import * as RedisSMQ from "rsmq";

/**
 * @author Alberto Ielpo
 */
export class RedisSMQApp {
    constructor() {}

    private rsmq: RedisSMQ | undefined;

    /**
     *
     * @param config
     */
    public init(config: RedisSMQAppConfig): void {
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
            this.rsmq?.listQueues(function (err, queues) {
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
    public async getQueueAttributes(
        qname: string
    ): Promise<RedisSMQ.QueueAttributes> {
        return new Promise((resolve, reject) => {
            this.rsmq?.getQueueAttributes(
                { qname: qname },
                function (err, resp) {
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
                }
            );
        });
    }

    /**
     *
     * @param qname
     * @param payload
     * @returns
     */
    public async sendMessage(qname: string, payload: unknown): Promise<string> {
        return new Promise((resolve, reject) => {
            this.rsmq?.sendMessage(
                { qname: qname, message: JSON.stringify(payload) },
                function (err, resp) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }

                    console.log("Message sent. ID:", resp);
                    resolve(resp);
                }
            );
        });
    }

    /**
     *
     * @param config
     * @param queue
     * @param payload
     */
    public async exec(
        config: RedisSMQAppConfig,
        queue: string,
        payload: unknown
    ) {
        try {
            console.log("start...");
            this.init(config);

            if (this.rsmq === undefined) throw new Error("Rsmq is undefined");
            console.log("init done...");

            const timeout = setTimeout(() => {
                throw new Error("Connection timeout");
            }, 10_000);

            const listQueues: string[] = await this.listQueues();
            clearTimeout(timeout);
            console.log(listQueues);

            if (Array.isArray(listQueues) && listQueues.indexOf(queue) != -1) {
                await this.sendMessage(queue, payload);
            } else {
                throw new Error(`Queue ${queue} not found!`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            console.log("end...");
        }
    }
}

export type RedisSMQAppConfig = { host: string; port: number; ns: string };
