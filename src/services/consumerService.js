"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");
const notiModel = require("../models/notification.model");
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
      let data;
      channel.consume(notifQueue, (msg) => {
        const noti = msg.content.toString();
        data = noti;
        console.log("SEND notificationQueue successfully processed:", noti);
        channel.ack(msg);
      });
      console.log(data);
      data &&
        (await notiModel.create({
          noti_senderId: data.senderId,
          noti_recieverId: data.recieverId,
          noti_option: data.option,
          noti_type: data.type,
        }));
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
