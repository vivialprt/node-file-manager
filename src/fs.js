import {
    writeFile,
    rm,
    rename as fsRename,
    access
} from 'fs/promises';
import path from 'path';


export const getAbsPath = (cwd, fName) => {
    return path.isAbsolute(fName) ? fName : path.join(cwd, fName);
};


export const create = async (cwd, fName) => {
    try {
        const fullPath = getAbsPath(cwd, fName);
        await writeFile(fullPath, '', { flag: 'wx' });
    } catch (err) {
        if (err.code == 'EEXIST')
            throw Error('FS operation failed');
        else
            throw err;
    }

};


export const remove = async (cwd, fName) => {
    const fullPath = getAbsPath(cwd, fName);

    try {
        await rm(fullPath);
    } catch (err) {
        if (err.code == 'ENOENT')
            throw Error('FS operation failed');
        else
            throw err;
    }
};


export const rename = async (cwd, incorrectName, correctName) => {
    let fullIncorrectName = getAbsPath(cwd, incorrectName);
    let fullCorrectName = getAbsPath(cwd, correctName);

    try {
        await access(fullCorrectName);
        throw Error('FS operation failed');
    } catch (err) {
        if (err.code != 'ENOENT')
            throw err;       
    }

    try {
        await fsRename(fullIncorrectName, fullCorrectName);
    } catch (err) {
        if (err.code == 'ENOENT')
            throw Error('FS operation failed');
        else
            throw err;
    }
};


export default 'amogus';
