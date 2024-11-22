const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka1:9092", "kafka2:9092"],
});

async function createProducer() {
  const producer = kafka.producer();
  await producer.connect();
  return producer;
}

async function produceMessage(topic, messages) {
  const producer = await createProducer();
  await producer.send({
    topic,
    messages,
  });
  await producer.disconnect();
}

module.exports = kafka;
