import { Block } from "../types";
import { getUnixTimestamp, newUuid } from "../utils";
import { GENESIS_ADDRESS } from "./genesisAddress";
import { TOTAL_SUPPLY } from "./totalSupply";

export const genesisBlock: Block = {
  blockNumber: 0,
  blockTimestamp: getUnixTimestamp(),
    hash: "0",
    previousHash: "0",
    nonce: 0,
    transactions: [
      {
        transactionId: newUuid(),
        transactionTimestamp: getUnixTimestamp(),
        senderAddress: "0",
        receiverAddress: GENESIS_ADDRESS,
        amount: TOTAL_SUPPLY,
      },
    ],
  };