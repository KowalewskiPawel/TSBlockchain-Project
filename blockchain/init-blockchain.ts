import { genesisBlock } from "./consts";
import { writeBlockchain, writeTransactions } from "./utils";

writeBlockchain([genesisBlock]);
writeTransactions([]);
