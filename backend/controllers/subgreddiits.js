const subgreddiitsRouter = require('express').Router()

const auth = require('../middleware/auth')
const Subgreddiit = require('../models/subgreddiits')

subgreddiitsRouter.get('/', auth, async (request, response) => {
  await Subgreddiit.find({}).then(subgreddiits => {
    response.json(subgreddiits)
  })
})

subgreddiitsRouter.get('/visitor/:id', auth, async (request, response, next) => {
  let currentDate = new Date()
  currentDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear()

  const sub = await Subgreddiit.findById(request.params.id)

  const subStats = sub.stats
  let flag = false

  for (let i = 0; i < subStats.length; i++) {
    if (subStats[i].date.localeCompare(currentDate) === 0) {
      const id = subStats[i]._id.toString()

      await Subgreddiit.updateOne({ "stats": { "$elemMatch": { "date": currentDate } } }, { $inc: { "stats.$.visitors": 1 } });
      flag = true
    }
  }

  if (!flag) {
    let newObj = {
      date: currentDate,
      posts: 0,
      visitors: 1,
      members: sub.followers.length,
      reports: 0,
      deletedPosts: 0
    }

    await Subgreddiit.findByIdAndUpdate(sub.id,
      { "$push": { stats: newObj } })
  }
})

subgreddiitsRouter.get('/:id', auth, async (request, response, next) => {
  await Subgreddiit.findById(request.params.id)
    .then(subgreddiit => {
      if (subgreddiit) {
        response.json(subgreddiit)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

subgreddiitsRouter.post('/', auth, async (request, response, next) => {
  const body = request.body

  const subgreddiit = new Subgreddiit({
    name: body.name,
    description: body.description,
    tags: body.tags,
    bannedKeywords: body.bannedKeywords,
    followers: body.followers,
    createdBy: body.createdBy,
    posts: body.posts,
    blockedUsers: body.blockedUsers,
    joinRequests: body.joinRequests,
    image: body.image,
    blacklisted: body.blacklisted,
    creationDate: new Date(),
    stats: []
  })

  await subgreddiit.save()
    .then(savedSubgreddiit => {
      response.status(201).json(savedSubgreddiit)
    })
    .catch(error => next(error))
})

subgreddiitsRouter.put('/:id', auth, async (request, response, next) => {
  const { name, description, tags, bannedKeywords, followers, createdBy, posts, blockedUsers, joinRequests, image, blacklisted, creationDate, stats } = request.body

  let currentDate = new Date()
  currentDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear()

  const sub = await Subgreddiit.findOne({ name: name })

  const subStats = sub.stats
  let flag = false

  for (let i = 0; i < subStats.length; i++) {
    if (subStats[i].date.localeCompare(currentDate) === 0) {
      const id = subStats[i]._id.toString()

      await Subgreddiit.updateOne({ "stats": { "$elemMatch": { "date": currentDate } } }, { $inc: { "stats.$.members": 1 } });
      flag = true
    }
  }

  if (!flag) {
    let newObj = {
      date: currentDate,
      posts: 1,
      visitors: 1,
      members: sub.followers.length,
      reports: 0,
      deletedPosts: 0
    }

    await Subgreddiit.findByIdAndUpdate(sub.id,
      { "$push": { stats: newObj } })
  }

  Subgreddiit.findByIdAndUpdate(
    request.params.id,
    { name, description, tags, bannedKeywords, followers, createdBy, posts, blockedUsers, joinRequests, image, blacklisted, creationDate, stats },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedSubgreddiit => {
      response.json(updatedSubgreddiit)
    })
    .catch(error => next(error))
})

subgreddiitsRouter.delete('/:id', auth, (request, response, next) => {
  Subgreddiit.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = subgreddiitsRouter