export const getOne = model => async (req, res) => {
  const doc = await model
    .findOne({
      id: req.params._id,
      createdBy: req.user._id
    })
    .exec()
  if (!doc) {
    return res.status(404).end()
  }

  res.status(200).json({ data: doc })
}

export const getMany = model => async (req, res) => {
  const docs = await model.find({ createdBy: req.user._id }).exec()
  if (!docs.length) res.status(404).end()

  res.status(200).json({ data: docs })
}

// const req = {
//   user: { _id: user },
//   body
// }
export const createOne = model => async (req, res) => {
  const doc = await model.create({ ...req.body, createdBy: req.user._id })

  res.status(201).json({ data: doc })
}

// const req = {
//   params: { id: list._id },
//   user: { _id: user },
//   body: update
// }
export const updateOne = model => async (req, res) => {
  const doc = await model
    .findOneAndUpdate(
      {
        id: req.params._id,
        createdBy: req.user._id
      },
      req.body,
      { new: true }
    )
    .exec()
  if (!doc) {
    return res.status(400).end()
  }

  res.status(201).json({ data: doc })
}

export const removeOne = model => async (req, res) => {
  const doc = await model
    .findOneAndRemove({
      id: req.params._id,
      createdBy: req.user._id
    })
    .exec()

  if (!doc) {
    return res.status(400).end()
  }

  res.status(201).json({ data: doc })
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
