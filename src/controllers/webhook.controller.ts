import { RequestHandler } from "express";
import { parseSwapTx } from "../utils/mainnet/index";
const { flowQuoteAndSwap } = require("../utils/jupiter/index");

export const receiveTransactions: RequestHandler = async (req, res, next) => { 
    console.log("Occured!!!!!!!!!")
    await flowQuoteAndSwap()
}