import { createHash } from 'node:crypto';
import { readFile } from 'fs/promises';
import path from 'path';

export const calculateHash = async (cwd, fName) => {
    const fullPath = path.isAbsolute(fName) ? fName : path.join(cwd, fName);

    const buffer = await readFile(fullPath);
    return createHash('sha256').update(buffer).digest('hex');
};
