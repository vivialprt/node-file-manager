export const parseArgs = () => {
    const args = {};

    for (let i = 0; i < process.argv.length; i++)
        if (process.argv[i].startsWith('--')) {
            let [k, v] = process.argv[i].replace('--', '').split('=');
            args[k] = v;
        }

    return args;
};


export const parseEnv = () => {
    const rssVars = [];

    for (let [key, value] of Object.entries(process.env))
        if (key.startsWith('RSS_'))
            rssVars.push(`${key}=${value}`);

    console.log(rssVars.join('; '));
};
