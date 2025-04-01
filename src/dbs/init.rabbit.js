"use strict";
const ampq = require("amqplib");
const AMQP_URL_CLOUD =
  "amqps://qemwnffm:NXeq6AfnsUemwc7AaPFHLUEcENpxpmYG@leopard.lmq.cloudamqp.com/qemwnffm";

const connectToRabbitMQ = async () => {
  try {
    const connection = await ampq.connect(AMQP_URL_CLOUD);
    if (!connection) throw new Error("Connection not established");
    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (err) {
    console.log("Error when connect: ", err);
  }
};

const connectToRabbitForTest = async () => {
  try {
    console.log("hello");
    const { channel, connection } = await connectToRabbitMQ();
    console.log("this is channel ", channel);
    const queue = "test-queue";
    const message = "This is test queue";
    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));
    await connection.close();
  } catch (err) {}
};

const consumerQueue = async ({ channel, queueName }) => {
  try {
    console.log("this is queue name: ", queueName);
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(
      queueName,
      (mess) => {
        console.log("message reciever: ", mess.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (err) {
    console.log("error consumerQueue : ", err);
  }
};

module.exports = { connectToRabbitForTest, connectToRabbitMQ, consumerQueue };
