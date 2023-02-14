const mongoose = require('mongoose')

const mongoUrl =
  `mongodb+srv://admin:admin@cluster0.mt9feak.mongodb.net/greddiit?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   userName: String,
//   email: String,
//   age: Number,
//   contact: Number,
//   password: String,
//   followers: [String],
//   following: [String],
// })

const subgreddiitSchema = new mongoose.Schema({
  name: String,
  description: String,
  tags: [String], 
  bannedKeywords: [String]
})

// const User = mongoose.model('User', userSchema)

const Subgreddiit = mongoose.model('Subgreddiit', subgreddiitSchema)

// const user = new User({
//   firstName: 'Nugga', lastName: 'Jugga', userName: 'breh', email: 'nugger@example.com', age: 69, contact: 123456789, password: 'Nugge', followers: ['HarshK23'], following: ['HarshK23']
// })

const subgreddiit = new Subgreddiit({
  name: "Announcements", description: "Official announcements from Greddiit, Inc.", tags: ["spoiler", "NSFW"], bannedKeywords: ["trash", "Crap", "shit", "fuck"]
})

user.save().then(result => {
  console.log(result)
  mongoose.connection.close()
})