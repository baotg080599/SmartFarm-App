import Paho from 'paho-mqtt';

const pahoConfig = {
  host: 'broker.hivemq.com',
  port: 8000,
  clientId: 'myclientid_' + parseInt(Math.random() * 100, 10),
  humidity: '8fbffcefdde168c6a63fe274e551b2bf6b050d15d54afde789ce779dbc4d614c',
};

const client = new Paho.Client(
  pahoConfig.host,
  pahoConfig.port,
  pahoConfig.clientId
);

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

function onConnect() {
  client.subscribe(pahoConfig.humidity);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log('onConnectionLost:' + responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
  console.log('onMessageArrived:' + message.payloadString);
}

function sendMessage(message, destination) {
  const pahoMessage = new Paho.Message(message);
  pahoMessage.destinationName = destination;
  client.send(pahoMessage);
}

function connectPahoClient() {
  client.connect({ onSuccess: onConnect });
}

export default client;
export { connectPahoClient, sendMessage };
