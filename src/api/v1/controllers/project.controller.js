import ProjectService from '../services/project.service.js'
import DatasetService from '../services/dataset.service.js'
import ImageService from '../services/image.service.js'
import LabelService from '../services/label.service.js'


import axios from 'axios'
import config from '#src/config/config.js'

const List = async (req, res) => {
    const { _id } = req.user
    try {
        const projects = await ProjectService.List(_id)
        return res.json(projects)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const Get = async (req, res) => {
    const { id } = req.params
    try {
        const project = await ProjectService.Get(id)
        return res.json(project)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const Create = async (req, res) => {
    const { _id } = req.user
    try {
        const project = await ProjectService.Create(_id, req.body)
        return res.json(project)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const Update = async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    try {
        await ProjectService.Update(id, { name })
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const Delete = async (req, res) => {
    const { _id } = req.user
    const { id } = req.params
    try {
        await ProjectService.Delete(_id, id)
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const UploadFiles = async (req, res) => {
    const { _id } = req.user
    const { id } = req.params
    const { type } = req.body
    try {
        const uploadedFiles = await ProjectService.UploadFiles(_id, id, req.files.files, type)
        // TODO
        // need to save dataset to database (id)
        return res.json(uploadedFiles)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error })
    }
}

const TrainModel = async (req, res) => {
    const { _id } = req.user
    const { id: projectID } = req.params

    try {
        console.log({ bucket_name: config.storageBucketName })

        //TODO: fix hardcode
        const payload = {
            "userEmail": "test-automl",
            "projectName": "4-animal",
            "training_time": 60,
            "runName": "ISE",
            "presets": "medium_quality",
            "dataset_url": "1QEhox5PADwRiL8h_cWtpp2vb229rKRXE",
            "gcloud_dataset_bucketname": "string",
            "gcloud_dataset_directory": "string",
            "dataset_download_method": "gdrive",
            "training_argument": {
                "data_args": { },
                "ag_model_args": {
                    "pretrained": true,
                    "hyperparameters": {
                        "model.timm_image.checkpoint_name": "swin_small_patch4_window7_224"
                    }
                },
                "ag_fit_args": {
                    "time_limit": 60,
                    "hyperparameters": {
                        "env.per_gpu_batch_size": 4,
                        "env.batch_size": 4
                    }
                }
            },
            "label_column": "label"
        }

        const { data } = await axios.post(`${config.mlServiceAddr}/model_service/train/image_classification`, payload)
        res.json(data)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const ListModel = async (req, res) => {
    const { _id } = req.user
    try {
        const data = await ProjectService.ListModel(_id)
        res.json(data)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const GetDatasets = async (req, res) => {
    const { id } = req.params
    try {
        const defaultPageSize = 24
        const images = await ImageService.List(id, 1, defaultPageSize)
        const files = images.data.files.map((value, index) => {
            return {
                _id: value._id,
                label: value.label,
                label_id: value.label_id,
                uid: value.uid,
                url: value.url
            }
        })
        const results = {
            'files': files,
            'labels': images.data.labels,
            'pagination': images.meta,
        }
        // console.log(results);
        return res.json(results)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

const ExplainInstance = async(req, res) => {
    // // const image = req.body.image
    // const {userEmail, projectName, runName } = JSON.parse(req.body.json);

    // console.log(userEmail, projectName, runName);

    // const options = {
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     }
    // }
    // try {
    //     const { data } = await axios.post(`${config.mlServiceAddr}/model_service/train/image_classification/explain`, {
    //         userEmail: userEmail,
    //         projectName: projectName,
    //         runName: runName,
    //         image: req.files.image
    //     }, options);


    //     const base64_image_str = data.explain_image;
    //     const explain_image_str = `data:image/jpeg;base64,${base64_image_str}`;

    //     return res.json({status: 'success', explain_image: explain_image_str})
    // } catch (err) {
    //     console.log(err);
    // }
}


const ProjectController = {
    List,
    Get,
    Create,
    Update,
    Delete,
    UploadFiles,
    TrainModel,
    ListModel,
    GetDatasets,
    ExplainInstance
}

export default ProjectController
