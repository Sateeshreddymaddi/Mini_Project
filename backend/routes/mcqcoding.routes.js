import { Router } from 'express';
const router = Router();
import { addQuestions,
        getAllQuestions,
        submitQuestion
} from '../controllers/mcqcoding.controller.js';

router.post('/add-mcqcoding', addQuestions);
router.get('/mcqcodingquestions', getAllQuestions);
router.post('/submit', submitQuestion);

export default router;