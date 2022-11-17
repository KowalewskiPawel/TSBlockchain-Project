import { Transaction } from "./transaction"

export type Block = {
    blockNumber: number,
    blockTimestamp: number,
    hash: string,
    previousHash: string,
    nonce: number,
    transactions: Transaction[]
}