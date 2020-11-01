import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'requires email and password' })
  }
  try {
    const user = await User.create(req.body)
    const token = await newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(400).send({ message: 'requires email and password' })
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'requires email and password' })
  }
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).send({ message: 'user must be real' })
    }

    const match = await user.checkPassword(req.body.password)
    if (!match) {
      return res.status(401).send({ message: 'user must be real' })
    }

    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(400).send({ message: 'requires email and password' })
  }
}

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
  }
  try {
    const token = req.headers.authorization.split('Bearer ')[1]
    if (!token) {
      return res.status(401).end()
    }
    const payload = await verifyToken(token)
    console.log(payload)
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    req.user = user
    next()
  } catch (e) {
    console.error(e)
    return res.status(401).end()
  }
}
