import { parseArgs } from "./cli.js";
import {
    USERNAME_PARAM,
    DEFAULT_USERNAME,
    WELCOME_MESSAGE_TEMPLATE,
    EXIT_MESSAGE_TEMPLATE,
    CWD_MESSAGE_TEMPLATE,
    INVALID_INPUT_MESSAGE,
    OPERATION_FAILED_MESSAGE
} from "./constants.js";
import { cd } from "./navigation.js";
import createInterface from 'readline';


class App {
    constructor() {
        this.processInput = this.processInput.bind(this);
        this.run = this.run.bind(this);
        this.teardown = this.teardown.bind(this);
    };

    run() {
        const args = parseArgs();
        this.cwd = process.env['HOME'];

        if (args.hasOwnProperty(USERNAME_PARAM))
            this.username = args[USERNAME_PARAM];
        else
            this.username = DEFAULT_USERNAME;
        let welcomeMsg = WELCOME_MESSAGE_TEMPLATE.replace(
            '{username}', this.username
        );
        this.say(welcomeMsg);
        let cwdMsg = CWD_MESSAGE_TEMPLATE.replace(
            '{cwd}', this.cwd
        );
        this.say(cwdMsg);
        this.prompt();

        process.stdin.on('data', this.processInput)

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

    async processInput (buf) {
        let msg = this._decodeBuffer(buf)

        switch (msg) {
            case '.exit':
                this.teardown();
            case 'up':
                try {
                    await this.up();
                } catch {
                    this.say(OPERATION_FAILED_MESSAGE);
                };
                break;
            default:
                this.say(INVALID_INPUT_MESSAGE);
        }

        let cwdMsg = CWD_MESSAGE_TEMPLATE.replace(
            '{cwd}', this.cwd
        );
        this.say(cwdMsg);
        this.prompt();
    };

    async up () {
        this.cwd = await cd(this.cwd, '..');
    };

    say (msg) {
        process.stdout.write(msg + '\n\n');
    };

    prompt () {
        process.stdout.write('> ');
    }

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
