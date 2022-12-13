import path from 'path';
import { open, constants, readdir } from 'fs/promises';

export const cd = async (currentDir, dirToChange) => {
    if (path.isAbsolute(dirToChange)) {
        let fd = await open(dirToChange, constants.O_DIRECTORY);    
        await fd.close()
        return dirToChange;
    }
    else {
        let newPath = path.normalize(path.join(currentDir, dirToChange));
        let fd = await open(newPath, constants.O_DIRECTORY);
        await fd.close()
        return newPath;
    }
};

export const ls = async (cwd) => {
    let entries = await readdir(cwd, { withFileTypes: true });
    let dirs = [];
    let files = [];

    for (let entry of entries)
        if (entry.isFile())
            files.push({'Name': entry['name'], 'Type': 'file'});
        else if (entry.isDirectory())
            dirs.push({'Name': entry['name'], 'Type': 'directory'});

    const compare = (a, b) => a.Name.localeCompare(b.Name);
    return dirs.sort(compare).concat(files.sort(compare));
};