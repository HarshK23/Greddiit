const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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

const postSchema = new mongoose.Schema({
  title: {type: String, required: true},
  text: {type: String, required: true},
  postedBy: {type: String, required: true},
  postedIn: {type: String, required: true},
  upvotes: {type: Number, required: true},
  downvotes: {type: Number, required: true}
})

postSchema.plugin(uniqueValidator)

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Post', postSchema)

