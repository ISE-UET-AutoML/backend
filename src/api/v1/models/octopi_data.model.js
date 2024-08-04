import { Schema, model } from 'mongoose'
import { DatasetTypes } from '../data/constants.js'

const schema = new Schema(
    {
        dataset_id: { type: Schema.Types.ObjectId, required: true, ref: 'OCTP_Dataset' },
        // for training
        value: { type: Schema.Types.Mixed, required: true }, //! remember to call markModified('value') befor save
        is_valid: { type: Boolean, required: true, default: true }, // determine if the data is used for training
        // for managing
        anotator_id: { type: Schema.Types.ObjectId, ref: 'User' },

    },
    { timestamps: true }
)

const OCTP_Data = model('OCTP_Data', schema)
export default OCTP_Data
