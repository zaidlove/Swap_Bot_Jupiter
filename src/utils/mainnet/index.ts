import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import base58 from "bs58";
import "dotenv/config";

const WALLET_PRIVATE_KEY : any = process.env.WALLET_PRIVATE_KEY

const { SOL_ADDRESS, RAYDIUM_ADDRESS } = require('../constants')

export const getBalance = async () => {
    const RPC_URL = process.env.RPC_URL ? process.env.RPC_URL : ""
    const connection = new Connection( RPC_URL )
    try{
        const feePayer = Keypair.fromSecretKey( base58.decode(WALLET_PRIVATE_KEY) );
        const balance = await connection.getBalance( feePayer.publicKey );
        return balance / LAMPORTS_PER_SOL
    } catch( e:any ){
        return 0
    }
}

export const parseSwapTx = async ( tx: any ) => {
  // console.log(tx)
  // const signerPubKey = tx['feePayer']
  // let tokenAmount : any;
  // tx['tokenTransfers'].map( async (instruction : any) => {
  //   if(instruction['fromUserAccount'] == signerPubKey)
  //     tokenAmount[instruction['mint']] -= instruction['tokenAmount']
  //   else if(instruction['toUserAccount'] == signerPubKey)
  //     tokenAmount[instruction['mint']] += instruction['tokenAmount']
  // })
    // const signature = tx["signature"] ? tx["signature"] : ""
    // const poolId = tx["nativeTransfers"][5]["toUserAccount"] ? tx["nativeTransfers"][5]["toUserAccount"] : ""
    // let tokenAddress = "", quoteTokenAmount = 0, baseTokenAmount = 0;
    // let tokenAmounts = {}

    // tx["tokenTransfers"].map( async ( instruction : any ) => {
    // })

    // return { poolId, tokenAddress, baseTokenAmount }
}

// export const getTokenAccountBalanceByOwner = async ( address: string, decimal: number ) => {
//   const RPC_URL = process.env.RPC_URL ? process.env.RPC_URL : ""
//   const connection = new Connection( RPC_URL )
//   const tokenAddress = new PublicKey(address)
//   const owner = Keypair.fromSecretKey( base58.decode(WALLET_PRIVATE_KEY) )
//   const res = await connection.getTokenAccountsByOwner( owner.publicKey, { mint: tokenAddress } )
//   const account = SPL_ACCOUNT_LAYOUT.decode( res.value[0].account.data )
//   const maxAmount = account.amount.toNumber() / 10 ** decimal
//   return maxAmount
// }

let score = 0
export const rugcheck1 = async ( tokenAddress : string ) => {
  let flag = true
  try {
    const security = await fetch(`https://api.rugcheck.xyz/v1/tokens/${tokenAddress}/report`)
    const securities = await security.json();
    if(securities !== null){
        score = securities.score
        console.log("ski312-score", score)
        if(score > 5000 || score === undefined){
          flag = true
        } else {
          flag = false
        }
    }
    return flag
  } catch (error) {
      console.log('error')
      return flag
  }
}

export const getTxnStatus = async (txid: any) => {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY ? process.env.HELIUS_API_KEY : ""
  const RPC_URL = `https://api.helius.xyz/v0/transactions/?api-key=${HELIUS_API_KEY}`;

  const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          transactions: [txid],
      }),
  });

  const data = await response.json();
  const status = !data[0].transactionError ? "Success" : "Failed"
  let tokenAmount = 0, solAmount = 0;
  if( status == "Success" ){
    const tokenTrnasfers = data[0].tokenTransfers
    solAmount = tokenTrnasfers[0].mint === SOL_ADDRESS ? tokenTrnasfers[0].tokenAmount : tokenTrnasfers[1].tokenAmount
    tokenAmount = tokenTrnasfers[0].mint === SOL_ADDRESS ? tokenTrnasfers[1].tokenAmount : tokenTrnasfers[0].tokenAmount
  }
  return { status : status, solAmount: solAmount, tokenAmount : tokenAmount }
};

export const getTokenPrices = async ( ids: any[] ) => {

    let market = Object();
    try {
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${ids}`
      )
      const tokenJsonList = await res.json()
      const tokenPriceList = [] as any[]
      ids.map((tokenId : any) =>{
          const index = tokenJsonList["pairs"].findIndex((tokenJson : any) => tokenJson["baseToken"]["address"] == tokenId)
          
          if(index == -1) tokenPriceList.push(-1)
          else            tokenPriceList.push(tokenJsonList["pairs"][index]["priceNative"])
      })
      return tokenPriceList
      
    } catch (error) {
      console.log("Retry calling market...");
      return;
    }
}

export const confirmTransaction = async ( txid: any ) => {
  const RPC_URL = process.env.RPC_URL ? process.env.RPC_URL : ""
  const connection = new Connection( RPC_URL )
  const latestBlockHash = await connection.getLatestBlockhash("finalized");

  try {
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: txid
    })
    return "confirmed";
  } catch (error) {
    return "failed";
  }
}