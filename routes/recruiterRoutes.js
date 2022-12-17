const express = require('express')
const router = express.Router();

const reqLogger = require('../middlewares/reqLogger')
const protectedRoute = require('../middlewares/auth')

const {
    recruiterValidator,
    adminValidator
} = require('../middlewares/utils/validator')

const {
    getRecruiters,
    postRecruiter,
    deleteRecruiters,
    getRecruiter,
    updateRecruiter,
    deleteRecruiter,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout

} = require('../controllers/recruiterController');

// root
router.route('/')
    .get(reqLogger, getRecruiters)
    .post(reqLogger, recruiterValidator, postRecruiter)
    // .delete(reqLogger, protectedRoute, adminValidator, deleteRecruiters)

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

// /:recruiterId
router.route('/:recruiterId')
    .get(reqLogger, getRecruiter)
    .put(reqLogger, protectedRoute, updateRecruiter)
    .delete(reqLogger, protectedRoute, deleteRecruiter)


module.exports = router