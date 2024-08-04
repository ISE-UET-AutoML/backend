import { Schema, model } from 'mongoose'
import { DatasetTypes } from '../data/constants.js'

const schema = new Schema(
    {
        project_id: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
        name: { type: String, required: true, default: 'Untitled Dataset' },
        type: { type: String, required: true, default: DatasetTypes.IMAGE_DIRECTORY },
        // for training
        // list of (json properties or csv columns) that are uses to describe the dataset
        __img: { type: [String] }, //* image columns
        __txt: { type: [String] }, //* text columns
        __cls: { type: [String] }, //* classiffied columns and boolean values
        __igr: { type: [String] }, //* ignored columns
        __val: { type: [String] }, //* value columns

        __lbl: { type: String, required: true }, //* label column
        // for managing 
    },
    { timestamps: true }
)

const OCTP_Dataset = model('OCTP_Dataset', schema)
export default OCTP_Dataset
