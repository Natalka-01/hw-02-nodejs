import { Router } from 'express';
import { createAnnouncement, getAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement} from '../controllers/announcement.controller.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { announcementSchema, updateAnnouncementSchema, getAnnouncementsQuerySchema} from '../validators/announcement.validator.js';


const router = Router();


router.get('/', validateQuery(getAnnouncementsQuerySchema), getAnnouncements);

router.get('/:id', getAnnouncementById);


router.post('/', authenticate, validateBody(announcementSchema), createAnnouncement);

router.patch('/:id', authenticate, validateBody(updateAnnouncementSchema), updateAnnouncement);

router.delete('/:id', authenticate, deleteAnnouncement);

export default router;