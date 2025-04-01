const { before } = require("lodash");
const mongoose = require("mongoose");
const mongUrl = "mongodb+srv://mitu:hihi@cluster0.tloz2.mongodb.net/?";

const TestSchema = new mongoose.Schema({ name: String });
const test = mongoose.model("Test", TestSchema);

describe("Mongo test connection", () => {
  beforeAll(async () => {
    connection = await mongoose.connect(mongUrl);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  it("successfully connect to mongo", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
