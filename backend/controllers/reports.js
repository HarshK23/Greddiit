const reportsRouter = require('express').Router()
const nodemailer = require('nodemailer')

const Report = require('../models/reports')
const Subgreddiit = require('../models/subgreddiits')

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
    associatedPost: body.associatedPost,
    postText: body.postText,
    postedIn: body.postedIn,
    verdict: body.verdict,
  })

  let currentDate = new Date()
  currentDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear()

  const sub = await Subgreddiit.findOne({ name: report.postedIn })

  const subStats = sub.stats
  let flag = false

  for (let i = 0; i < subStats.length; i++) {
    if (subStats[i].date.localeCompare(currentDate) === 0) {
      const id = subStats[i]._id.toString()

      await Subgreddiit.updateOne({ "stats": { "$elemMatch": { "date": currentDate } } }, { $inc: { "stats.$.reports": 1 } });
      flag = true
    }
  }

  if (!flag) {
    let newObj = {
      date: currentDate,
      posts: 0,
      visitors: 1,
      members: sub.followers.length,
      reports: 1,
      deletedPosts: 0
    }

    await Subgreddiit.findByIdAndUpdate(sub.id,
      { "$push": { stats: newObj } })
  }

  await report.save()
    .then(savedReport => {
      response.status(201).json(savedReport)
    })
    .catch(error => next(error))
})

// reportsRouter.post('/:id', async (request, response, next) => {
//   const testAccount = await nodemailer.createTestAccount()
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass
//     }
//   })

//   Report.findById(request.params.id)
//     .then(report => {
//       const info = transporter.sendMail({
//         from: '"Greddiit" <karwalharshit@gmail.com>',
//         to: `harshitkarwal@hotmail.com`,
//         subject: 'Your report has been reviewed',
//         text: `Your report on ${report.reportedUser} has been reviewed, and the verdict is: ${request.body.givenVerdict}`
//       })

//       console.log('Message sent: %s', info.messageId)
//       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

//       response.status(200)
//     })
// })

reportsRouter.put('/:id', (request, response, next) => {
  const { reportedBy, reportedUser, concern, associatedPost, postText, postedIn, verdict } = request.body

  Report.findByIdAndUpdate(
    request.params.id,
    { reportedBy, reportedUser, concern, associatedPost, postText, postedIn, verdict },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedReport => {
      response.json(updatedReport)
    })
    .catch(error => next(error))
})

reportsRouter.delete('/:id', async (request, response, next) => {
  Report.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = reportsRouter