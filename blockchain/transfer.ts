import { MINIMUM_GAS_FEE } from "./consts";
import { Transaction } from "./types";
import {
  ec,
  getAddressBalance,
  getTransactions,
  getUnixTimestamp,
  newUuid,
  writeTransactions,
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
    .sign(senderPublicAddress + amount)
    .toDER("hex");

  const isBalanceEnough =
    getAddressBalance(senderPublicAddress) >= amount + gasFee;

  if (!isBalanceEnough) throw Error("Insufficient balance");

  const currentTransactions = getTransactions();

  const transaction: Transaction = {
    transactionId: newUuid(),
    transactionTimestamp: getUnixTimestamp(),
    senderAddress: senderPublicAddress,
    receiverAddress: receiverPublicKey,
    amount,
    gasFee,
    signature,
  };

  writeTransactions([...currentTransactions, transaction]);
};
