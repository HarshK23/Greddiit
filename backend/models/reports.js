const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const mongoUrl = process.env.MONGODB_URI
console.log('connecting to', mongoUrl)

mongoose.connect(mongoUrl)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const reportSchema = new mongoose.Schema({
  createdAt: {type: Date, default: Date.now, expires: 864000},
  reportedBy: {type: String, required: true},
  reportedUser: {type: String, required: true},
  concern: {type: String, required: true},
  associatedPost: {type: String, required: true},
  postText: {type: String, required: true},
  postedIn: {type: String, required: true},
  verdict: {type: String, required: true},
})

reportSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Report', reportSchema)