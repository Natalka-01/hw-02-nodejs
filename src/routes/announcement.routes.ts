import { Router } from 'express';
import { createAnnouncement, getAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement} from '../controllers/announcement.controller.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { announcementSchema, updateAnnouncementSchema, getAnnouncementsQuerySchema, idParamSchema} from '../validators/announcement.validator.js';


const router = Router();


router.get('/', validateQuery(getAnnouncementsQuerySchema), getAnnouncements);




router.post('/', authenticate, validateBody(announcementSchema), createAnnouncement);

router.get('/:id', validateParams(idParamSchema), getAnnouncementById);
router.patch('/:id', authenticate, validateParams(idParamSchema), validateBody(updateAnnouncementSchema), updateAnnouncement);
router.delete('/:id', authenticate, validateParams(idParamSchema), deleteAnnouncement);
export default router;