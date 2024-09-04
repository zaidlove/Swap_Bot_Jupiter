import { Router } from "express"
import { receiveTransactions } from "../controllers/webhook.controller"
const router = Router()

router.post( '/', receiveTransactions )

export default router