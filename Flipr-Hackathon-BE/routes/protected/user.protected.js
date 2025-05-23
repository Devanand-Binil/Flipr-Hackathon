import { Router } from 'express';
import multer from 'multer';
import {
  allUsers,
  getmyself,
  uploadProfileImage,
  updateProfile,
  invitingUser,
} from '../../controllers/userControllers.js';

const router = Router();

// Configure multer for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.get('/', allUsers);
router.get('/getmyself', getmyself);
router.put('/updateprofile', updateProfile);
router.post('/invitefriends', invitingUser);
router.put('/profilepic', upload.single('image'), uploadProfileImage);

export default router;