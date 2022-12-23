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
    getUser,
    updateUser,
    deleteUser,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
    searchJobs,
    applyJob,
    getAppliedJobs,
    deleteJobApplication,
    postResume

} = require('../controllers/userController')

// ----------------------------- USER 

// ROOT ENDPOINTSS
router.route('/')
    .get(reqLogger, getUsers)
    .post(reqLogger, userValidator, postUser)

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

// USER SPECIFIC ENDPOINT
router.route('/:userId')
    .get(reqLogger, protectedRoute, getUser)
    .put(reqLogger, protectedRoute, updateUser)
    .delete(reqLogger, protectedRoute, deleteUser)

// ----------------------------- APPLY JOB

// FETCH ALL THE AVAILABLE JOBS POSTED AND APPLY
router.route('/:userId/apply')
    .get(reqLogger, protectedRoute, searchJobs)
    .post(reqLogger, protectedRoute, applyJob)

// FETCH APPLIED JOBS AND CAN DELETE
router.route('/:userId/applied-jobs')
    .get(reqLogger, protectedRoute, getAppliedJobs)
    .delete(reqLogger, protectedRoute, deleteJobApplication)

// UPLOAD CV
router.route('/:userId/upload')
    .post(reqLogger, protectedRoute, postResume)

module.exports = router
