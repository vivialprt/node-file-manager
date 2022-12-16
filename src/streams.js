import { createReadStream, createWriteStream } from 'fs';
import path, { resolve } from 'path';


export const read = async (cwd, fName) => {
    let fullPath;
    if (path.isAbsolute(fName))
        fullPath = fName;
    else
        fullPath = path.join(cwd, fName);
    const readStream = createReadStream(fullPath, 'utf8');
    readStream.on('data', (chunk) => {
        process.stdout.write(chunk);
    });
    
    const readEnd = new Promise((resolve, reject) => {
        readStream.on('end', () => resolve());
    });

    await readEnd;
};


export const write = async () => {
    const fileName = 'src/streams/files/fileToWrite.txt';
    const writeStream = createWriteStream(fileName);
    process.stdin.pipe(writeStream);
};


export const copy = async (cwd, src, dst) => {
    let fullSrc = path.isAbsolute(src) ? src : path.join(cwd, src);
    let fullDst = path.isAbsolute(dst) ? dst : path.join(cwd, dst);

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
