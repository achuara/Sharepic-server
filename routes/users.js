import express from 'express';

import { signin, signup, getUser, getAllUserBySearch, googleAuth } from '../controllers/user.js';// 

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/googleAuth', googleAuth);

router.get('/:userId', getUser);
router.get('/search/:userId', getAllUserBySearch); // user searching

export default router;