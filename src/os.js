import os from 'os';
import { inspect } from 'util';

export const getOsInfo = async (param) => {
    switch (param) {
        case '--EOL':
            return inspect(os.EOL, { showHidden: true }) + '\n';

        case '--cpus':
            let info = os.cpus()
            let total = `Total: ${info.length}`;
            info = info.map(core => `Model: ${core.model} Clock Rate: ${Math.round((core.speed * 0.001 + Number.EPSILON) * 1000) / 1000} GHz`);
            info = [total, ...info].join('\n');
            return info + '\n';

        default:
            throw new Error();
    }
};
