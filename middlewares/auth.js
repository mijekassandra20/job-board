const User = require('../models/User')
const Recruiter = require('../models/Recruiter')
const jwt = require('jsonwebtoken')

const protectedRoute = async (req, res, next) => {
    let token; 

    // check if req.headers.authorization contains a 'Bearer' token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // check if no token exists
    if (!token) throw new Error('Not authorized to access this route!!');

    try {
        // verify if the token is real and matches the user
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // fetch for the user, and add a user object to the req object!
        req.user = await User.findById(decoded.id)
        req.recruiter = await Recruiter.findById(decoded.id)
        
        // if(req.user) req.user = await User.findById(decoded.id)
        // if(req.recruiter) req.recruiter = await Recruiter.findById(decoded.id)

        next();

    } catch (err) {
        throw new Error('Not authorized to access this route!!')
    }
}



module.exports = protectedRoute;