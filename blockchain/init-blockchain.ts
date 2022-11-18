import { genesisBlock } from "./consts";
import { writeBlockchain, writeTransactions } from "./utils";

export const initBlockchain = () => {
  writeBlockchain([genesisBlock]);
  writeTransactions([]);
};
