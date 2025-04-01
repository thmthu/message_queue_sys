"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue({ channel, queueName });
    } catch (err) {
      console.log("cusumer service: ", err);
    }
  },
};
module.exports = { messageService };
