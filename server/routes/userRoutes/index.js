const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const authenticate = require('../../middleware/authenticate');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify/:emailVerificationHash', userController.verifyEmail);
router.post('/sendPasswordResetEmail', userController.sendPasswordResetEmail);
router.post('/reset-password', userController.resetPassword);
router.post('/resend-verification', userController.resendVerificationEmail);
router.post('/logout', authenticate, userController.logout);
router.get('/:id', authenticate, userController.getUser);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);
router.get('/', authenticate, userController.getAllUsers);
router.post('/book-appointment', authenticate, userController.bookAppointment);
router.post('/addNewUser', authenticate, userController.addNewUser);

module.exports = router;
