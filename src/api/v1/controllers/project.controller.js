import ProjectService from '../services/project.service.js'
import DatasetService from '../services/dataset.service.js'
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
            "projectName": "titanic",
            "training_time": 60,
            "runName": "ISE",
            "presets": "medium_quality",
            "dataset_url": "1yIkh7Wvu4Lk1o6gVIuyXTb3l9zwNXOCE",
            "gcloud_dataset_bucketname": config.storageBucketName,
            "gcloud_dataset_directory": `label/${projectID}/`,
            "dataset_download_method": "gcloud",
            "label_column": "label",
            "training_argument": {
                "data_args": {},
                "ag_model_args": {
                    "hyperparameters": {
                        "model.timm_image.checkpoint_name": "swin_small_patch4_window7_224"
                    },
                    "pretrained": true
                },
                "ag_fit_args": {
                    "hyperparameters": {
                        "env.batch_size": 4,
                        "env.per_gpu_batch_size": 4
                    },
                    "time_limit": 60
                }
            }
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

const ProjectController = {
    List,
    Get,
    Create,
    Update,
    Delete,
    UploadFiles,
    TrainModel,
    ListModel
}

export default ProjectController
