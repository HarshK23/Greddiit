require('dotenv').config()

const express = require('express')
const cors = require('cors')

const usersRouter = require('./controllers/users')
const subgreddiitsRouter = require('./controllers/subgreddiits')
const reportsRouter = require('./controllers/reports')
const postsRouter = require('./controllers/posts')
const loginRouter = require('./controllers/login')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json({ limit: '50mb' }));

app.use('/api/users', usersRouter)
app.use('/api/subgreddiits', subgreddiitsRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/posts', postsRouter)
app.use('/api/login', loginRouter)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name == 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name == 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})