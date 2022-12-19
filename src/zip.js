import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream } from 'node:fs';
import { promisify } from 'node:util';
import path from 'path';


export const createZipFunction = async (cwd, src, dst, mode = 'compress') => {
    let compressStream;
    if (mode === 'compress')
        compressStream = createBrotliCompress();
    else if (mode === 'decompress')
        compressStream = createBrotliDecompress();
    else
        throw new Error();

    const fullSrc = path.isAbsolute(src) ? src : path.join(cwd, src);
    const fullDst = path.isAbsolute(dst) ? dst : path.join(cwd, dst);

    const pipe = promisify(pipeline);

    const readStream = createReadStream(fullSrc);
    await new Promise((resolve, reject) => {
        readStream.on('open', resolve);
        readStream.on('error', reject);
    });

    const writeStream = createWriteStream(fullDst);
    await new Promise((resolve, reject) => {
        writeStream.on('open', resolve);
        writeStream.on('error', reject);
    });

    await pipe(readStream, compressStream, writeStream);
};
