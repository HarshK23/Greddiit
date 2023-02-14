const postsRouter = require('express').Router()

const Post = require('../models/posts')

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
    downvotes: body.downvotes
  })

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

postsRouter.delete('/:id', (request, response, next) => {
  Post.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = postsRouter