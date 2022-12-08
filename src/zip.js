import { createGzip, createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream } from 'node:fs';
import { promisify } from 'node:util';


export const compress = async () => {
    const src = 'src/zip/files/fileToCompress.txt';
    const dst = 'src/zip/files/archive.gz';
    const pipe = promisify(pipeline);

    try {

        const readStream = createReadStream(src);
        const writeStream = createWriteStream(dst);
        const compressStream = createGzip();
        await pipe(readStream, compressStream, writeStream);

    } catch (err) {
        if (err.code == 'ENOENT')
            throw Error('No such file');
        else
            throw Error('Pishi ashibku');
    }

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
