export const parseArgs = () => {
    const args = [];

    for (let i = 0; i < process.argv.length; i++)
        if (process.argv[i].startsWith('--'))
            args.push(`${process.argv[i].replace('--', '')} is ${process.argv[i + 1]}`);

    console.log(args.join(', '));
};


export const parseEnv = () => {
    const rssVars = [];

    for (let [key, value] of Object.entries(process.env))
        if (key.startsWith('RSS_'))
            rssVars.push(`${key}=${value}`);

    console.log(rssVars.join('; '));
};
