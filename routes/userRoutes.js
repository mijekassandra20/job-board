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
    deleteJobApplication

} = require('../controllers/userController')

// ----------------------------- USER 

// ROOT ENDPOINTSS
router.route('/')
    .get(reqLogger, protectedRoute, getUsers)
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
    .get(reqLogger, getUser)
    .put(reqLogger, protectedRoute, updateUser)
    .delete(reqLogger, protectedRoute, deleteUser)

// ----------------------------- APPLY JOB

// FETCH ALL THE AVAILABLE JOBS POSTED AND APPLY
router.route('/:userId/apply')
    .get(reqLogger, searchJobs)
    .post(reqLogger, applyJob)

// FETCH APPLIED JOBS AND CAN DELETE
router.route('/:userId/applied-jobs')
    .get(reqLogger, getAppliedJobs)
    .delete(reqLogger, deleteJobApplication)

module.exports = router
