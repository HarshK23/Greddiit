const postsRouter = require('express').Router()

const Post = require('../models/posts')
// const subgreddiitServ = require('./subgreddiit')
const Subgreddiit = require('../models/subgreddiits')

postsRouter.get('/', async (request, response) => {
  await Post.find({}).then(posts => {
    response.json(posts)
  })
})

postsRouter.get('/:id', async (request, response, next) => {
  await Post.findById(request.params.id)
    .then(post => {
      if (post) {
        response.json(post)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

postsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const post = new Post({
    title: body.title,
    text: body.text,
    postedBy: body.postedBy,
    postedIn: body.postedIn,
    upvotes: body.upvotes,
    downvotes: body.downvotes,
  })

  let currentDate = new Date()
  currentDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear()

  const sub = await Subgreddiit.findOne({ name: post.postedIn })

  const subStats = sub.stats
  let flag = false

  for (let i = 0; i < subStats.length; i++) {
    if (subStats[i].date.localeCompare(currentDate) === 0) {
      const id = subStats[i]._id.toString()

      await Subgreddiit.updateOne({ "stats": { "$elemMatch": { "date": currentDate } } }, { $inc: { "stats.$.posts": 1 } });
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

  await post.save()
    .then(savedPost => {
      response.status(201).json(savedPost)
    })
    .catch(error => next(error))
})

postsRouter.put('/:id', (request, response, next) => {
  const { title, text, postedBy, postedIn, upvotes, downvotes } = request.body

  Post.findByIdAndUpdate(
    request.params.id,
    { title, text, postedBy, postedIn, upvotes, downvotes },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPost => {
      response.json(updatedPost)
    })
    .catch(error => next(error))
})

postsRouter.delete('/:id', async (request, response, next) => {
  let currentDate = new Date()
  currentDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear()

  const post = await Post.findById(request.params.id)

  const sub = await Subgreddiit.findOne({ name: post.postedIn })

  const subStats = sub.stats
  let flag = false

  for (let i = 0; i < subStats.length; i++) {
    if (subStats[i].date.localeCompare(currentDate) === 0) {
      const id = subStats[i]._id.toString()

      await Subgreddiit.updateOne({ "stats": { "$elemMatch": { "date": currentDate } } }, { $inc: { "stats.$.deletedPosts": 1 } });
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

  Post.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = postsRouter