export const parseArgs = () => {
    const args = {};

    for (let i = 0; i < process.argv.length; i++)
        if (process.argv[i].startsWith('--')) {
            let [k, v] = process.argv[i].replace('--', '').split('=');
            args[k] = v;
        }

    return args;
};
