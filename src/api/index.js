// api/index.js
const serverless = require("serverless-http");
const app = require("../../index"); // adjust path if needed

module.exports = serverless(app);
