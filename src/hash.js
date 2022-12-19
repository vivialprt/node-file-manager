import { createHash } from 'node:crypto';
import { readFile } from 'fs/promises';
import { getAbsPath } from './fs.js';

export const calculateHash = async (cwd, fName) => {
    const fullPath = getAbsPath(cwd, fName);

    const buffer = await readFile(fullPath);
    return createHash('sha256').update(buffer).digest('hex');
};
