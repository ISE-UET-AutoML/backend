import { Router } from 'express'
import ImageController from '#api/controllers/image.controller.js'

const imageRouter = Router()

imageRouter.get('/', ImageController.List)
imageRouter.delete('/:id', ImageController.Delete)
imageRouter.put('/:id/labels', ImageController.LabelImage)
imageRouter.get('/:id', ImageController.UpdateImage)


export default imageRouter
