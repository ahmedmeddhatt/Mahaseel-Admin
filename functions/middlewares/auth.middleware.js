const { ErrorMessage } = require('../assets/errors')
const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
        const token = req.headers.authorization
        if (!token) return res.status(401).json({ message: ErrorMessage.token_not_found})
        else {
            jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, value) => {
               // console.log(value)
                if (err) res.status(401).json({   message: ErrorMessage.JWT_EXPIRED})
                if(value.role !== 'admin') {res.status(403).json({   message: ErrorMessage.ACCESS_DENIED}) }
                req.user = value
                next()
            })
        }
}




