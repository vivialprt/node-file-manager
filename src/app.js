import { parseArgs } from "./cli.js";
import { USERNAME_PARAM, DEFAULT_USERNAME } from "./constants.js"

class App {
    constructor() {
        this.input = this.input.bind(this);
    };

    run() {
        const args = parseArgs();

        if (args.hasOwnProperty(USERNAME_PARAM))
            this.username = args[USERNAME_PARAM];
        else
            this.username = DEFAULT_USERNAME;

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
