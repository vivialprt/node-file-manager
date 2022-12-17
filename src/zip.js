import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream } from 'node:fs';
import { promisify } from 'node:util';
import path from 'path';


export const compress = async (cwd, src, dst) => {
    const fullSrc = path.isAbsolute(src) ? src : path.join(cwd, src);
    const fullDst = path.isAbsolute(dst) ? dst : path.join(cwd, dst);

    const pipe = promisify(pipeline);

    const readStream = createReadStream(fullSrc);
    await new Promise((resolve, reject) => {
        readStream.on('open', resolve);
        readStream.on('error', reject);
    });

    const writeStream = createWriteStream(fullDst, { flags: 'wx' });
    await new Promise((resolve, reject) => {
        writeStream.on('open', resolve);
        writeStream.on('error', reject);
    });

    const compressStream = createBrotliCompress();

    await pipe(readStream, compressStream, writeStream);

};


export const decompress = async () => {
    const src = 'src/zip/files/archive.gz';
    const dst = 'src/zip/files/fileToCompress2.txt';
    const pipe = promisify(pipeline);

    try {

        const readStream = createReadStream(src);
        const writeStream = createWriteStream(dst);
        const decompressStream = createGunzip();
        await pipe(readStream, decompressStream, writeStream);

    } catch (err) {
        if (err.code == 'ENOENT')
            throw Error('No such file');
        else
            throw Error('Pishi ashibku');
    }

};
