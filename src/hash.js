import { createHash } from 'node:crypto';
import { readFile } from 'fs/promises';

export const calculateHash = async () => {
    const fileName = 'src/hash/files/fileToCalculateHashFor.txt';
    const buffer = await readFile(fileName);
    console.log(createHash('sha256').update(buffer).digest('hex'));
};
