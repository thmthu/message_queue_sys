"use strict";
require("./src/dbs/init.mongo");

const { messageService } = require("./src/services/consumerService");

messageService
  .consumerToQueueNormal()
  .then(() => console.log("index recieve mess"))
  .catch((err) => console.log("index have err ", err));
messageService
  .consumeToQueueFailed()
  .then(() => console.log("index recieve mess"))
  .catch((err) => console.log("index have err ", err));
