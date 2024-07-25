import axios from 'axios'
import config from '#src/config/config.js'
import Project from '#api/models/project.model.js'
import Image from '#api/models/image.model.js'
import Experiment from '#api/models/experiment.model.js'
import { ProjectCodePrefixes, PROJECT_CODE_LEN, ProjectTypes } from '../data/constants.js'
import { randomString } from '#api/utils/string.util.js'
import StorageService from './storage.service.js'
import LabelService from './label.service.js'
import DatasetService from './dataset.service.js'
import ImageService from './image.service.js'
import ExperimentService from './experiment.service.js'
import MLModel from '../models/mlmodel.model.js'

const List = async (userID) => {
  try {
    const projects = await Project.find({ author: userID }).sort('-createdAt')
    return projects
  } catch (error) {
    console.error(error)
    throw error
  }
}

const Get = async (projectID) => {
  try {
    const project = await Project.findOne({ _id: projectID })
    if (!project) {
      throw new Error('Project does not exist')
    }
    return project
  } catch (error) {
    console.error(error)
    throw error
  }
}

const Create = async (userID, { name, description, expectation_accuracy, type }) => {
  if (!ProjectTypes.hasOwnProperty(type)) {
    return res.status(400).json({ error: 'Project type invalid' })
  }

  try {
    const existingProject = await Project.findOne({ name })
    if (existingProject != undefined) {
      throw new Error('Project already exist')
    }

    const projectCode = generateProjectCode(type)
    const project = new Project({
      name,
      description,
      expectation_accuracy,
      type,
      code: projectCode,
      author: userID,
    })

    await project.save()
    return project
  } catch (error) {
    console.error(error)
    throw error
  }
}

const Update = async (projectID, updateInfo) => {
  try {
    const project = await Project.findOne({ _id: projectID })
    if (project == undefined) {
      throw new Error('Project does not exist')
    }

    if (updateInfo.name) {
      const existingProject = await Project.findOne({ _id: projectID, name })
      if (existingProject != undefined) {
        throw new Error('Project name is already taken')
      }
    }
    await project.updateOne(updateInfo)
  } catch (error) {
    console.error(error)
    throw error
  }
}

const Delete = async (userID, projectID) => {
  try {
    const project = await Project.findOne({ _id: projectID, author: userID })
    if (project == undefined) {
      throw new Error('Project does not exist')
    }

    const images = await Image.find({ project_id: projectID })
    if (images && images.length > 0) {
      const imageKeys = images.map((image) => image.key)
      // TODO: Use transaction
      await StorageService.DeleteFiles(imageKeys)
      await ImageService.DeleteByProject(projectID)
      await LabelService.DeleteAllByProject(projectID)
      await DatasetService.DeleteAllByProject(projectID)
      await Project.deleteOne({ _id: projectID })
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const hard_result = {
  files: [
    {
      _id: "66a1b8b09f8fb2c9bbcc20e6",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: 'yzq0ucwx',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/u6analwpaqnyzzjld21j.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20e7",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: 'b36k6a2q',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/m4iw6cdbom0w5rmaog1y.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20e8",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: 'wmgarkl8',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/fa5lwohe9rceestyqrzm.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20e9",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: '9hqx6jfl',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/72wfev4cmp5i6iz27ros.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20ea",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: '2fo111mt',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/gzxvngyevb2tjcgw4jw7.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20eb",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: 'ttubqvgc',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/871xsijmaxeq43g45cj6.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20ec",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: 'iy57rua6',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/lgjzn45ot7xt4pkd8myg.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20ed",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: 'xx1jlt6s',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/59en4hg5q6x9h9q7a97o.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20ee",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: 'ngdobxv2',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/2ojqtxndspcdslzia056.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20ef",
      label: 'cat',
      label_id: "669dba93cbf3047b91bcfd2d",
      uid: '9llyhze3',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/cat/ft4xsln2qc27lfn3cbl0.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f0",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: '76rvl5kx',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/fzptym7unowj5s6a3xyo.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f1",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: 'lpqmcefi',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/6qtp05esxuebehp50eyi.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f2",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: 'd2g6ej2d',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/hg1mlpbx2rk7moazmof1.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f3",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: 's9lb4pzl',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/nqy22477p585fg5mvnq4.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f4",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: '1wilnnee',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/60pov380jsn4t1qz5u1y.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f5",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: 'kt9co4eh',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/loig4ww2dmtly3y65nx5.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f6",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: '12f2ydda',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/i21j18e0sae7sblj5psr.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f7",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: '6ne39aln',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/xxb1lywgvbv5pz9v83dn.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f8",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: '25lipsoh',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/ho6a5fatvkthuw7qiwq3.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20f9",
      label: 'horse',
      label_id: "669dba93cbf3047b91bcfd2e",
      uid: '7rq99836',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/horse/4jj0nsgrtskc33eyvtvh.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20fa",
      label: 'dog',
      label_id: "669dba93cbf3047b91bcfd2f",
      uid: '1cg544ac',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/dog/3rq96sccirp9el807hu6.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20fb",
      label: 'dog',
      label_id: "669dba93cbf3047b91bcfd2f",
      uid: 'l3o2fueu',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/dog/diecjnuy855yg0zb57ra.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20fc",
      label: 'dog',
      label_id: "669dba93cbf3047b91bcfd2f",
      uid: 'aigadzku',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/dog/cesbowak3syxbsq7hbhr.jpg'
    },
    {
      _id: "66a1b8b09f8fb2c9bbcc20fd",
      label: 'dog',
      label_id: "669dba93cbf3047b91bcfd2f",
      uid: 'ettmdqf2',
      url: 'https://storage.googleapis.com/automl_uet_bucket/label/669db9d7874defb77a6be5b1/dog/dsho8z59uafqowym5eyi.jpg'
    }
  ],
  labels: [
    { id: '669dba93cbf3047b91bcfd2d', value: 'cat' },
    { id: '669dba93cbf3047b91bcfd2e', value: 'horse' },
    { id: '669dba93cbf3047b91bcfd2f', value: 'dog' },
    { id: '669dba93cbf3047b91bcfd30', value: 'deer' }
  ],
  pagination: { page: 1, size: 24, total_page: 2 }
}

const UploadFiles = async (userID, projectID, files, uploadType) => {
  try {
    const project = await Project.findOne({ _id: projectID }).populate('author')
    if (project == undefined) {
      throw new Error('Project not found')
    }
    // Shallow compare because project.author._id is ObjectId, _id is string
    if (project.author._id != userID) {
      throw new Error('Forbidden')
    }

    if (!files) {
      throw new Error('Files can not be empty')
    }

    const uploadedFiles = await StorageService.UploadLocalFiles(project._id, files, uploadType)
    
    return uploadedFiles
  } catch (error) {
    console.error(error)
    throw error
  }
}

const TrainModel = async (projectID) => {
  try {
    const dataset = await DatasetService.ListByProject(projectID)
    const labelMap = await LabelService.GetLabelMap(projectID)
    const classes = Object.keys(labelMap)
    const experiment = await ExperimentService.LatestByProject(projectID)
    const experimentName = experiment.name

    const payload = {
      project_id: projectID,
      experiment_name: experimentName,
      gcs_folder: dataset.pattern,
      gcs_output: `gs://${config.storageBucketName}/datasets/${experimentName}/`,
      dataset_url: `gs://${config.storageBucketName}/datasets/${experimentName}/*.tfrec`,
      target_size: 224,
      classes,
      num_classes: classes.length,
    }

    const { data } = await axios.post(`${config.mlServiceAddr}/clf/train`, payload)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const ListModel = async (userID) => {
  try {
    const models = await MLModel.find({ author_id: userID }).sort('-createdAt')
    return models
  } catch (error) {
    console.error(error)
    throw error
  }
}

const generateProjectCode = (projectType) => {
  const prefix = ProjectCodePrefixes[projectType]
  const code = randomString(PROJECT_CODE_LEN)
  return `${prefix}-${code}`
}

const ProjectService = { List, Get, Create, Update, Delete, UploadFiles, TrainModel, ListModel }

export default ProjectService
