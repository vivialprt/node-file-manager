import { parseArgs } from "./cli.js";
import {
    USERNAME_PARAM,
    DEFAULT_USERNAME,
    WELCOME_MESSAGE_TEMPLATE
} from "./constants.js"

class App {
    constructor() {
        this.input = this.input.bind(this);
        this.run = this.run.bind(this);
    };

    run() {
        const args = parseArgs();

        if (args.hasOwnProperty(USERNAME_PARAM))
            this.username = args[USERNAME_PARAM];
        else
            this.username = DEFAULT_USERNAME;
        let welcomeMsg = WELCOME_MESSAGE_TEMPLATE.replace(
            '{username}', this.username
        );
        this.say(welcomeMsg);

        process.stdin.on('data', this.input)
    };

    input (msg) {
        this.say(msg);
    };

    say (msg) {
        process.stdout.write(msg + '\n');
    };
};


const app = new App();
app.run();
