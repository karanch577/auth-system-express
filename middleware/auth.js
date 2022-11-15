let jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    // the cookieParser inject the cookies in the request object
    // we no need to use cookieParser in every file, it is done once in the index.js file
    // it is used as a middleware 
    // but for the jwt we have to require it
    const {token} = req.cookies;

    if(!token) {
      return res.status(400).json({
        message: "token is not present"
      })
    }
    // verify the token
    try {
      // jwt will throw an error if token is incorrect or invalid
      const decode = jwt.verify(token, process.env.SECRET)
      req.user = decode
    } catch (error) {
        // this block will execute if the token in not verified
      res.status(400).json({
        message: "token in invalid"
      })
    }
    next()
}

module.exports = auth