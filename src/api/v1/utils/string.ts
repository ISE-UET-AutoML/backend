import { randomBytes } from 'crypto';
import path from 'path';


const randomString = (length: number) => {
    return randomBytes(length)
        .toString('base64')  // or 'hex'
        .slice(0, length);  // Return the string with the desired length
};
const randomUID = () => {
    return randomString(8)
}

const getLabelAndFilePath = (inputPath: string) => {
    const label = path.basename(path.dirname(inputPath)); // Gets the last part of the directory name
    const filePath = path.normalize(inputPath); // Cleans up the path

    if (!label || !filePath) {
        console.error('Invalid path format:', inputPath);
        return { label: null, path: inputPath };
    }

    return { label, path: filePath };
};



export { randomString, randomUID, getLabelAndFilePath }
