const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1]

      let decodedData

      if (token) {
        if (token.length > 500) {
          decodedData = jwt.decode(token)

          req.userId = decodedData?.sub
        } else {
          decodedData = jwt.verify(token, process.env.SECRET)

          req.id = decodedData?.id
        }
        next()
      }
    } catch (error) {
      console.log(error)
      res.json({ message: 'You are not authorized' })
    }
  } else {
    res.json({ message: 'You are not authorized' })
  }
}

module.exports = auth