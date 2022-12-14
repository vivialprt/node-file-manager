import { createReadStream, createWriteStream } from 'fs';
import path from 'path';


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
