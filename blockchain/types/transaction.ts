export type Transaction = {
  transactionId: string;
  transactionTimestamp: number;
  senderAddress: string;
  receiverAddress: string;
  gasFee?: number;
  amount: number;
  signature?: string;
};
