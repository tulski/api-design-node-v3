import { Router } from 'express'

const router = Router()

const controller = (req, res) => {
  res.send({ message: 'ok' })
}

// api/item
router
  .route('/')
  .get(controller)
  .post(controller)

// api/item/:id
router
  .route('/:id')
  .get(controller)
  .put(controller)
  .delete(controller)

export default router
