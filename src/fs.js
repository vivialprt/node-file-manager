import {
    cp,
    mkdir,
    writeFile,
    rm,
    readdir,
    readFile,
    rename as fsRename,
    access
} from 'fs/promises';
import path from 'path';


export const copy = async () => {
    const src = 'src/fs/files';
    const dst = 'src/fs/files_copy';
    try {
        await mkdir(dst);
        await cp(src, dst, { recursive: true });
    } catch (err) {
        if (err.code == 'EEXIST' || err.code == 'ENOENT')
            throw Error('FS operation failed');
        else
            throw err;
    }
};


export const create = async (cwd, fName) => {
    try {
        let fullPath;
        if (path.isAbsolute(fName))
            fullPath = fName;
        else
            fullPath = path.join(cwd, fName);
        await writeFile(fullPath, '', { flag: 'wx' });
    } catch (err) {
        if (err.code == 'EEXIST')
            throw Error('FS operation failed');
        else
            throw err;
    }

};


export const remove = async (cwd, fName) => {
    const fullPath = path.isAbsolute(fName) ? fName : path.join(cwd, fName);

    try {
        await rm(fullPath);
    } catch (err) {
        if (err.code == 'ENOENT')
            throw Error('FS operation failed');
        else
            throw err;
    }
};


export const list = async () => {
    const dirPath = 'src/fs/files';

    try {
        let dirContents = await readdir(dirPath);
        for(let fName of dirContents)
            console.log(fName);
    } catch (err) {
        if (err.code == 'ENOENT')
            throw Error('FS operation failed');
        else
            throw err;
    }
};


export const read = async () => {
    const filePath = 'src/fs/files/fileToRead.txt';

    try {
        let fileContents = await readFile(filePath, { encoding: 'utf8' });
        console.log(fileContents);
    } catch (err) {
        if (err.code == 'ENOENT')
            throw Error('FS operation failed');
        else
            throw err;
    }
};


export const rename = async (cwd, incorrectName, correctName) => {
    let fullIncorrectName = path.isAbsolute(incorrectName) ? incorrectName : path.join(cwd, incorrectName);
    let fullCorrectName = path.isAbsolute(correctName) ? correctName : path.join(cwd, correctName);

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
