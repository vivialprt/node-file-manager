import { parseArgs } from "./cli.js";
import {
    USERNAME_PARAM,
    DEFAULT_USERNAME,
    WELCOME_MESSAGE_TEMPLATE,
    EXIT_MESSAGE_TEMPLATE
} from "./constants.js";
import createInterface from 'readline';


class App {
    constructor() {
        this.input = this.input.bind(this);
        this.run = this.run.bind(this);
        this.teardown = this.teardown.bind(this);
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

        if (process.platform === "win32") {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });
          
            rl.on("SIGINT", function () {
                process.emit("SIGINT");
            });
        }
          
        process.on("SIGINT", this.teardown);
    };

    input (buf) {
        let msg = this._decodeBuffer(buf)
        if (msg == '.exit')
            this.teardown();
        else
            this.say(msg);
    };

    say (msg) {
        process.stdout.write(msg + '\n');
    };

    teardown (exitCode = 0) {
        let exitMsg = EXIT_MESSAGE_TEMPLATE.replace(
            '{username}', this.username
        );
        this.say('\n' + exitMsg);
        process.exit(exitCode);
    };

    _decodeBuffer (str) {
        return str.toString().replace(/(\r\n|\n|\r)/gm, "");
    };
};


const app = new App();
app.run();
