const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

const User = require('../models/users')

usersRouter.get('/', async (request, response) => {
  await User.find({}).then(users => {
    response.json(users)
  })
})

usersRouter.get('/:id', async (request, response, next) => {
  await User.findById(request.params.id)
    .then(user => {
      if (user) {
        response.json(user)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    firstName: body.firstName,
    lastName: body.lastName,
    userName: body.userName,
    email: body.email,
    age: body.age,
    contact: body.contact,
    password: passwordHash,
    followers: body.followers,
    following: body.following,
    savedPosts: body.savedPosts,
  })

  await user.save()
    .then(savedUser => {
      response.status(201).json(savedUser)
    })
    .catch(error => next(error))
})

usersRouter.put('/:id', async (request, response, next) => {
  console.log(request.body)
  const { firstName, lastName, userName, email, age, contact, password, followers, following, savedPosts } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  await User.findByIdAndUpdate(
    request.params.id,
    { firstName, lastName, userName, email, age, contact, passwordHash, followers, following, savedPosts },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedUser => {
      response.json(updatedUser)
    })
    .catch(error => next(error))
})

usersRouter.delete('/:id', async (request, response, next) => {
  await User.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = usersRouter