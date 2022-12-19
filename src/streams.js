import { createReadStream, createWriteStream } from 'fs';
import { getAbsPath } from './fs.js';
import { stat } from 'fs/promises';
import path from 'path';


export const read = async (cwd, fName) => {
    const fullPath = getAbsPath(cwd, fName);
    const readStream = createReadStream(fullPath, 'utf8');
    readStream.on('data', (chunk) => {
        process.stdout.write(chunk);
    });
    
    const readEnd = new Promise((resolve, reject) => {
        readStream.on('end', () => resolve());
    });

    await readEnd;
};


export const copy = async (cwd, src, dst) => {
    const fullSrc = getAbsPath(cwd, src);
    let fullDst = getAbsPath(cwd, dst);

    let dstStat = await stat(fullDst);
    if (!dstStat.isDirectory())
        throw new Error();
    fullDst = path.join(fullDst, path.basename(src));

    const readStream = createReadStream(fullSrc, 'utf8');
    await new Promise((resolve, reject) => {
        readStream.on('open', resolve);
        readStream.on('error', reject);
    });

    const writeStream = createWriteStream(fullDst, { flags: 'wx' });
    await new Promise((resolve, reject) => {
        writeStream.on('open', resolve);
        writeStream.on('error', reject);
    });

    readStream.on('data', (chunk) => {
        writeStream.write(chunk);
    });

    await new Promise((resolve, reject) => {
        readStream.on('end', () => {
            writeStream.destroy();
            resolve();
        });
    });
};
