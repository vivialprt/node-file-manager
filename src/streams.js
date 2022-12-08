import { createReadStream, createWriteStream } from 'fs';


export const read = async () => {
    const fileName = 'src/streams/files/fileToRead.txt';
    const readStream = createReadStream(fileName, 'utf8');

    readStream.on('data', (chunk) => {
        process.stdout.write(chunk);
    });
};


export const write = async () => {
    const fileName = 'src/streams/files/fileToWrite.txt';
    const writeStream = createWriteStream(fileName);
    process.stdin.pipe(writeStream);
};
