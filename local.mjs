import { handler } from "./index.mjs";

const event = {
  queryStringParameters: {
    labelKey: "chill",
  },
};

async function testHandler() {
  try {
    const result = await handler(event);
    console.log("Lambda result:", result);
  } catch (error) {
    console.error("Error running handler:", error);
  }
}

testHandler();
