const subgreddiitsRouter = require('express').Router()

const Subgreddiit = require('../models/subgreddiits')

subgreddiitsRouter.get('/', async (request, response) => {
  await Subgreddiit.find({}).then(subgreddiits => {
    response.json(subgreddiits)
  })
})

subgreddiitsRouter.get('/:id', async (request, response, next) => {
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

subgreddiitsRouter.post('/', async (request, response, next) => {
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
    image: body.image
  })

  await subgreddiit.save()
    .then(savedSubgreddiit => {
      response.status(201).json(savedSubgreddiit)
    })
    .catch(error => next(error))
})

subgreddiitsRouter.put('/:id', (request, response, next) => {
  const { name, description, tags, bannedKeywords, followers, createdBy, posts, blockedUsers, joinRequests, image } = request.body

  Subgreddiit.findByIdAndUpdate(
    request.params.id,
    { name, description, tags, bannedKeywords, followers, createdBy, posts, blockedUsers, joinRequests, image },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedSubgreddiit => {
      response.json(updatedSubgreddiit)
    })
    .catch(error => next(error))
})

subgreddiitsRouter.delete('/:id', (request, response, next) => {
  Subgreddiit.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = subgreddiitsRouter