import { Router } from 'express'
import { me, updateMe } from './user.controllers'

const router = Router()

const controller = (req, res) => {
  res.send({ message: 'ok', id: req.params.id })
}

// api/user/
router
  .route('/')
  .get(me)
  .post(controller)

// api/user/:id
router
  .route('/:id')
  .get(controller)
  .put(updateMe)
  .delete(controller)

export default router
