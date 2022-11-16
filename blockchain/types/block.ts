import { Transaction } from "./transaction"

export type Block = {
    hash: string,
    previousHash: string,
    nonce: number,
    transactions: Transaction[]
}