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
import { cd, ls } from "./navigation.js";
import {
    create
} from './fs.js';
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
        this.say(welcomeMsg + '\n\n');
        let cwdMsg = CWD_MESSAGE_TEMPLATE.replace(
            '{cwd}', this.cwd
        );
        this.say(cwdMsg + '\n');
        this.say('> ');

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
        let input = this._decodeBuffer(buf)
        let [msg, ...args] = input.split(' ');

        switch (msg) {
            case '.exit':
                this.teardown();

            case 'up':
                try {
                    await this.up();
                    this.say('\n');
                } catch {
                    this.say(OPERATION_FAILED_MESSAGE + '\n\n');
                };
                break;

            case 'cd':
                try {
                    if (args.length != 1)
                        throw new Error();
                    await this.cd(args[0]);
                    this.say('\n');
                } catch {
                    this.say(OPERATION_FAILED_MESSAGE + '\n\n');
                };
                break;

            case 'ls':
                try {
                    let table = await this.ls();
                    console.table(table);
                    this.say('\n');
                } catch {
                    this.say(OPERATION_FAILED_MESSAGE + '\n\n');
                };
                break;

            case 'add':
                try {
                    if (args.length != 1)
                        throw new Error();
                    await this.add(args[0]);
                    this.say('\n');
                } catch {
                    this.say(OPERATION_FAILED_MESSAGE + '\n\n');
                };
                break;

            default:
                this.say(INVALID_INPUT_MESSAGE + '\n\n');
        }

        let cwdMsg = CWD_MESSAGE_TEMPLATE.replace(
            '{cwd}', this.cwd
        );
        this.say(cwdMsg + '\n');
        this.say('> ');
    };

    async up () {
        this.cwd = await cd(this.cwd, '..');
    };

    async cd (newPath) {
        this.cwd = await cd(this.cwd, newPath);
    };

    async ls () {
        return await ls(this.cwd);
    }

    async add (fName) {
        await create(this.cwd, fName);
    }

    say (msg) {
        process.stdout.write(msg);
    };

    teardown (exitCode = 0) {
        let exitMsg = EXIT_MESSAGE_TEMPLATE.replace(
            '{username}', this.username
        );
        this.say('\n' + exitMsg + '\n\n');
        process.exit(exitCode);
    };

    _decodeBuffer (str) {
        return str.toString().replace(/(\r\n|\n|\r)/gm, "");
    };
};


const app = new App();
app.run();
