import { Router } from 'express';
import { createAnnouncement, getAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement} from '../controllers/announcement.controller.js';
import { validateBody } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { announcementSchema, updateAnnouncementSchema} from '../validators/announcement.validator.js';


const router = Router();

// Усі можуть бачити оголошення
router.get('/', getAnnouncements);

router.get('/:id', getAnnouncementById);

// Тільки авторизовані користувачі можуть створювати (перевіряємо токен і дані)
router.post('/', authenticate, validateBody(announcementSchema), createAnnouncement);

router.patch('/:id', authenticate, validateBody(updateAnnouncementSchema), updateAnnouncement);

router.delete('/:id', authenticate, deleteAnnouncement);

export default router;