const reqLogger = (req,  res, next) => {
    if(req) {
        console.log('Received request from client!')
    }
    
    next();
}

module.exports = reqLogger;