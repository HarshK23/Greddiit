const reportsRouter = require('express').Router()

const Report = require('../models/reports')

reportsRouter.get('/', async (request, response) => {
  await Report.find({}).then(reports => {
    response.json(reports)
  })
})

reportsRouter.get('/:id', async (request, response, next) => {
  await Report.findById(request.params.id)
    .then(report => {
      if (report) {
        response.json(report)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

reportsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const report = new Report({
    reportedBy: body.reportedBy,
    reportedUser: body.reportedUser,
    concern: body.concern,
    associatedPost: body.associatedPost
  })

  await report.save()
    .then(savedReport => {
      response.status(201).json(savedReport)
    })
    .catch(error => next(error))
})

reportsRouter.put('/:id', (request, response, next) => {
  const { reportedBy, reportedUser, concern, associatedPost } = request.body

  Report.findByIdAndUpdate(
    request.params.id,
    { reportedBy, reportedUser, concern, associatedPost },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedReport => {
      response.json(updatedReport)
    })
    .catch(error => next(error))
})

module.exports = reportsRouter