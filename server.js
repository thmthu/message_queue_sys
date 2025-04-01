"use strict";

const { messageService } = require("./src/services/consumerService");
const queuName = "test-topic";
messageService
  .consumerToQueue(queuName)
  .then(() => console.log("index recieve mess"))
  .catch((err) => console.log("index have err ", err));
