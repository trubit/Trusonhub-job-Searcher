import { Router } from 'express';
import { OfferController } from '../controllers/offer.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';
import { validate } from '../../../middleware/validate.js';
import { createOfferSchema, updateOfferSchema, respondOfferSchema } from '../schemas/offer.schema.js';

const router = Router();
const controller = new OfferController();

router.use(authenticate);

router.post('/', authorize('EMPLOYER', 'ADMIN'), validate(createOfferSchema), controller.createOffer);
router.get('/my/all', controller.getMyOffers);
router.get('/application/:applicationId', controller.getApplicationOffers);
router.get('/:id', controller.getOffer);

router.put('/:id', authorize('EMPLOYER', 'ADMIN'), validate(updateOfferSchema), controller.updateOffer);
router.post('/:id/send', authorize('EMPLOYER', 'ADMIN'), controller.sendOffer);
router.post('/:id/accept', authorize('JOB_SEEKER'), controller.acceptOffer);
router.post('/:id/decline', authorize('JOB_SEEKER'), validate(respondOfferSchema), controller.declineOffer);
router.post('/:id/withdraw', authorize('EMPLOYER', 'ADMIN'), validate(respondOfferSchema), controller.withdrawOffer);

export default router;
