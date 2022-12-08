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


export const create = async () => {
    try {
        const content = 'I am fresh and young';
        const filename = 'src/fs/files/fresh.txt';
        await writeFile(filename, content, { flag: 'wx' });
    } catch (err) {
        if (err.code == 'EEXIST')
            throw Error('FS operation failed');
        else
            throw err;
    }

};


export const remove = async () => {
    const filePath = 'src/fs/files/fileToRemove.txt';

    try {
        await rm(filePath);
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


export const rename = async () => {
    const path = 'src/fs/files';
    const incorrectName = 'wrongFilename.txt';
    const correctName = 'properFilename.md';

    let fullIncorrectName = [path, incorrectName].join('/');
    let fullCorrectName = [path, correctName].join('/');

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
