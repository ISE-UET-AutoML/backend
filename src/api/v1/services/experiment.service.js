import axios from 'axios'
import config from '#src/config/config.js'
import Experiment from '#api/models/experiment.model.js'
import MLModel from '#api/models/mlmodel.model.js'
import { ExperimentStatuses } from '../data/constants.js'
import LabelService from './label.service.js'
import ProjectService from './project.service.js'
import RunService from './run.service.js'

const Create = async ({ experiment_name, project_id }) => {
  try {
    await ProjectService.Get(project_id)
    const experiment = new Experiment({ name: experiment_name, project_id })
    await experiment.save()
  } catch (error) {
    console.error(error)
    throw error
  }
}

const Get = async (id) => {
  try {
    const experiment = await Experiment.findOne({ _id: id })
    if (!experiment) {
      throw new Error('Experiment does not exist')
    }
    return experiment
  } catch (error) {
    console.error(error)
    throw error
  }
}

const GetByName = async (name) => {
  try {
    const experiment = await Experiment.findOne({ name })
    if (!experiment) {
      throw new Error('Experiment does not exist')
    }
    return experiment
  } catch (error) {
    console.error(error)
    throw error
  }
}

const LatestByProject = async (projectID) => {
  try {
    const experiments = await Experiment.find({ project_id: projectID })
    if (!experiments || experiments.length == 0) {
      throw new Error('Project does not has any experiment')
    }
    return experiments[experiments.length - 1]
  } catch (error) {
    console.error(error)
    throw error
  }
}

const DeployModel = async (experimentName) => {
  try {
    const experiment = await Experiment.findOne({ name: experimentName })
    if (!experiment) {
      throw new Error('Experiment does not exist')
    }
    //MLModel.Create()

    // const bestRun = await RunService.GetBestExperimentRun(experiment._id)
    // const labelMap = await LabelService.GetLabelMap(experiment.project_id)
    // const labels = Object.keys(labelMap)
    // const payload = {
    //   classes: labels,
    //   target_size: 224,
    //   model_dir: bestRun.best_model_url,
    //   experiment_name: experiment.name,
    // }
    // const { data } = await axios.post(`${config.mlServiceAddr}/clf/deploy`, payload)
    // return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const GetTrainingGraph = async (experimentName) => {
  try {
    // const experiment = await Experiment.findOne({ name: experimentName })
    // if (!experiment) {
    //   throw new Error('Experiment does not exist')
    // }

    // TODO: get training graph from ml service
    const userEmail = 'test-automl'
    const projectName = '4-animal'
    const runName = 'ISE' // fixed
    const task_id = 'lastest' // 'lastest' to return lastest experiment or use experiment id to return specific experiment
    const request = (`${config.mlServiceAddr}/model_service/train/fit_history/?userEmail=${userEmail}&projectName=${projectName}&runName=${runName}&task_id=${task_id}`)
    const req = 'http://localhost:8670/model_service/train/fit_history/?userEmail=test-automl&projectName=4-animal&runName=ISE&task_id=lastest'
    const res = await axios.get(request, { accept: 'application/json' })
    // const bestRun = await RunService.GetBestExperimentRun(experiment._id)

    console.log(res.data)
    return res.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const SaveBestModel = async (userID, experimentName) => {
  try {
    const experiment = await Experiment.findOne({ name: experimentName })
    if (!experiment) {
      throw new Error('Experiment does not exist')
    }

    const bestRun = await RunService.GetBestExperimentRun(experiment._id)

    const model = new MLModel({
      name: 'Untitled Model 1',
      url: bestRun.best_model_url,
      project_id: experiment.project_id,
      author_id: userID,
    })
    await model.save()
    return model
  } catch (error) {
    console.error(error)
    throw error
  }
}

const ExperimentService = { Create, LatestByProject, Get, GetByName, DeployModel, GetTrainingGraph, SaveBestModel }
export default ExperimentService
