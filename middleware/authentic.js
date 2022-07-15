const jwr = require("jsonwebtoken");
const {jwtSecret} = require("../configurator")

exports.adminAuth = async (req, res, next) => {
    const token = req.cookie.jwtSecret
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({message: "Not authorized"})
            } else {
                if (decodedToken.role !== "admin") {
                    return res.status(401).json({message: "Not authorized"})
                } else {
                    next()
                }
            }
        })
    } else {
        return res.status(401).json({message: "Not authorised, token not available"})
    }
}

exports.userAuth = (req, red, next) => {
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.statud(401).json({message: "Not authorized"})
            } else {
                if (decodedToken.role !== "Basic") {
                    return res.status(401).json({message: "Not authorized"})
                } else {
                    next()
                }
            }
        })
    } else {
        return res.status(401).json({message: "Not authorized, token not available"})
    }
}