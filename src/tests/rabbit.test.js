const { describe } = require("node:test");
const { connectToRabbitForTest } = require("../dbs/init.rabbit");

describe("Test Rabbit connection", () => {
  it("Should successfully connect to Rabbit", async () => {
    const res = await connectToRabbitForTest();
     expect(res).toBe(undefined)
  });
});
