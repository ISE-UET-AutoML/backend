import { Schema, model } from 'mongoose'
import { DatasetTypes } from '../data/constants.js'

const schema = new Schema(
    {
        project_id: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
        name: { type: String, required: true, default: 'Untitled Dataset' },
        type: { type: String, required: true, default: DatasetTypes.CSV_MULTIMODAL },
        // for training
        // list of (json properties or csv columns) that are uses to describe the dataset
        _img: { type: [String] }, //* image columns
        _txt: { type: [String] }, //* text columns
        _cls: { type: [String] }, //* classiffied columns and boolean values
        _igr: { type: [String] }, //* ignored columns, this columns will not be used for training
        _val: { type: [String] }, //* value columns (int, float, etc)
        _dtm: { type: String }, //* datetime columns

        _lbl: { type: String, required: true }, //* label column

        labels: { type: [String] }, //* for classification
        // for managing 
    },
    { timestamps: true }
)

const OCTP_Dataset = model('OCTP_Dataset', schema)
export default OCTP_Dataset
