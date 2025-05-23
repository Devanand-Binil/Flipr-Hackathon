import { Router } from 'express';
import {
  registerUser,
  authUser,
  verifyEmail,
  resendVerificationLink,
  forgotPassword,
  resetPassword,
} from '../../controllers/userControllers.js';

const router = Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/resend/verificationlink', resendVerificationLink);
router.put('/verify', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

export default router;
