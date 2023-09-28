# rsmq-dispatcher
Dispatch redis messages into rsmq queue

## Getting started
Change properly main.ts part and execute the command "npm run start"
```
const config = {
    host: "127.0.0.1",
    port: 6379,
    ns: "{rsmq}"
};

const queue = "QUEUE-NAME";
const payload = {};
```
