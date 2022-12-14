const express = require('express');
const router = express.Router();

const reqLogger = require('../middlewares/reqLogger')
const protectedRoute = require('../middlewares/auth')

const {
    userValidator,
    adminValidator
} = require('../middlewares/utils/validator')

const {
    getUsers,
    postUser,
    deleteUsers,
    getUser,
    updateUser,
    deleteUser,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
    searchJobs

} = require('../controllers/userController')

// root
router.route('/')
    .get(reqLogger, protectedRoute, adminValidator, getUsers)
    .post(reqLogger, userValidator, postUser)
    .delete(reqLogger, protectedRoute, adminValidator, deleteUsers)

router.route('/login')
    .post(reqLogger, login)
    
router.route('/forgotpassword')
    .post(reqLogger, forgotPassword)

router.route('/resetpassword')
    .put(reqLogger, resetPassword)

router.route('/updatepassword')
    .put(reqLogger, protectedRoute, updatePassword)

router.route('/logout')
    .get(reqLogger, protectedRoute, logout)

// /:userId
router.route('/:userId')
    .get(reqLogger, getUser)
    .put(reqLogger, protectedRoute, updateUser)
    .delete(reqLogger, protectedRoute, deleteUser)


// ----------------------------------------------
router.route('/:userId/apply')
    .get(reqLogger, searchJobs)
    // .post(reqLogger)
    // .delete(reqLogger)

module.exports = router
