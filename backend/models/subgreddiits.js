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

const subgreddiitSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tags: { type: [String], required: false },
  bannedKeywords: { type: [String], required: true },
  followers: { type: [String], required: true },
  createdBy: { type: String, required: true },
  posts: { type: [String], required: false},
  blockedUsers: { type: [String], required: false },
  joinRequests: { type: [String], required: false },
  image: { type: String, required: false },
  blacklisted: { type: [String], required: false },
  creationDate: { type: Date, required: true },
  stats: [{
    date: { type: String, required: false },
    posts: { type: Number, required: false },
    visitors: { type: Number, required: false },
    members: { type: Number, required: false },
    reports: { type: Number, required: false },
    deletedPosts: { type: Number, required: false }
  }]
})

subgreddiitSchema.plugin(uniqueValidator)

subgreddiitSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Subgreddiit', subgreddiitSchema)