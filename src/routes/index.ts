import { Router } from 'express'
import webHookRouter from '../routes/webhook.route'
const router = Router();

router.use( '/frontrun', webHookRouter )

export default router;