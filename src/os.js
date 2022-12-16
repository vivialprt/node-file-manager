import os from 'os';
import { inspect } from 'util';

export const getOsInfo = async (param) => {
    switch (param) {
        case '--EOL':
            return inspect(os.EOL, { showHidden: true });

        default:
            throw new Error();
    }
};
