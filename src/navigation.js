import path from 'path';
import { open, constants } from 'fs/promises';

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
