
import {
    UploadTypes,
    ALLOWED_FILE_EXTENSIONS,
    ALLOWED_IMAGE_FILE_EXTENSIONS,
    GCS_HOST,
    UPLOAD_BATCH_SIZE,
    FILE_NAME_LEN,
} from '../data/constants.js'



const From_Image_Labeled_Folder = async (projectID, files) => {
    const isAllowedExtension = (fileName) => {
        const idx = fileName.lastIndexOf('.')
        if (idx <= 0) {
            return false
        }
        const ext = fileName.substring(idx + 1, fileName.length)
        return ALLOWED_IMAGE_FILE_EXTENSIONS.includes(ext)
    }
    const parseAndValidateFiles = (files) => {
        const validFiles = []
        const labels = []
        for (let i = 0; i < files.length; i++) {
            // Decode base64
            const originalFileName = Buffer.from(files[i].name, 'base64').toString('ascii')
            const { label, path } = getLabelAndFilePath(originalFileName)
            if (labels.indexOf(label) < 0) {
                labels.push(label)
            }
            files[i].name = path

            const fileName = files[i].name
            if (fileName.startsWith('.')) {
                continue
            }
            if (isAllowedExtension(fileName)) {
                files[i].name = generateUniqueFileName(files[i].name)
                validFiles.push(files[i])
            } else {
                console.error('File extension not supported: ', fileName)
                throw new Error('File extension not supported')
            }
        }
        return { labels, validFiles }
    }

    const folderPath = `public/media/upload/${projectID}`


    if (uploadType != UploadTypes.FOLDER)
        throw new Error('Invalid upload type')

    // Decode base64
    console.log(uploadType)
    for (const file of files) {
        const originalFileName = Buffer.from(file.name, 'base64').toString('ascii')
        console.log(originalFileName)
    }
}

const From_CSV_Multimodal = async (projectID, files) => {

}