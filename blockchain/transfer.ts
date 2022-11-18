import { MINIMUM_GAS_FEE } from "./consts";
import { Transaction } from "./types";
import {
  ec,
  getAddressBalance,
  getUnixTimestamp,
  newUuid,
} from "./utils";

export const transfer = (
  senderPrivateKey: string,
  amount: number,
  gasFee: number,
  receiverPublicKey: string
) => {
  if (!receiverPublicKey) throw Error("No receiver public key provided");

  if (!gasFee || gasFee < MINIMUM_GAS_FEE) throw Error("Gas fee is too low");

  const senderKeypair = ec.keyFromPrivate(senderPrivateKey);
  const senderPublicAddress = senderKeypair.getPublic("hex");
  const signature = senderKeypair
    .sign(senderPublicAddress + amount + gasFee)
    .toDER("hex");

  const isBalanceEnough =
    getAddressBalance(senderPublicAddress) >= amount + gasFee;

  if (!isBalanceEnough) throw Error("Insufficient balance");

  const transaction: Transaction = {
    transactionId: newUuid(),
    transactionTimestamp: getUnixTimestamp(),
    senderAddress: senderPublicAddress,
    receiverAddress: receiverPublicKey,
    amount,
    gasFee,
    signature,
  };

  return transaction;
};
