export type Transaction = {
  senderAddress: string;
  receiverAddress: string;
  gasFee?: number;
  amount: number;
  signature?: string;
};
