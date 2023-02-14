const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();

const User = require('../models/users');

loginRouter.post('/', async (request, response, next) => {
  const email = request.body.enteredEmail;
  const password = request.body.enteredPassword;

  const user = await User.findOne({ email })

  const ifCorrectPassword = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && ifCorrectPassword)) {
    return response.status(401).json({
      error: 'Invalid email or password'
    })
  }

  const userToken = {
    email: user.email,
    id: user.id
  }

  const token = jwt.sign(userToken, process.env.SECRET)
  console.log(token)

  response.status(200).send({ token, user })
})

module.exports = loginRouter;