import { channel } from "diagnostics_channel";
import * as redis from "redis";

const CHANNELS = {
  TEST: "TEST",
  MINEBLOCK: "MINEBLOCK",
};

const publisher = redis.createClient();
const subscriber = redis.createClient();

const handleMessage = (channel: string, message: string) => {
  switch (channel) {
    case CHANNELS.TEST:
      console.log(`The message: ${message}`);
      break;
    default:
      break;
  }
};

export const initPubSub = async () => {
  subscriber.subscribe([...Object.values(CHANNELS)], (channel, message) =>
    handleMessage(message, channel)
  );

  await publisher.connect();
  await subscriber.connect();
};

export const testChannel = () => {
  publisher.publish(CHANNELS.TEST, "testMessage");
};
