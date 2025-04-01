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
  consumerToQueueNormal: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notifQueue = "notiQueue";
      channel.consume(notifQueue, (msg) => {
        const noti = msg.content.toString();
        console.log("SEND notificationQueue successfully processed:", noti);
        channel.ack(msg);
        
      });
    } catch (error) {
      console.error(error);
    }
  },
  consumeToQueueFailed: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notiDlxExchange = "notiDlxExchange";
      const notiRoutingKeyDlx = "notiRoutingKeyDlx";
      const notQueueHandler = "notificationQueueHotFix";

      await channel.assertExchange(notiDlxExchange, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notiDlxExchange,
        notiRoutingKeyDlx
      );
      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            "has notification error:, pls hack fix:",
            msgFailed.content.toString()
          );
        },
        { noAck: true }
      );
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = { messageService };
