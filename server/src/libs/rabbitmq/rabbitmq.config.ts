import Broker from 'rascal';
import { config } from './configFile';

const BrokerAsPromised = Broker.BrokerAsPromised;

export async function initRabbitMQ() {
  try {
    const broker = await BrokerAsPromised.create(config);
    broker.on('error', console.error);

    const sendMessage = {
      transactionAmount: 15000,
      transactionHash: '9c6319c6c17592fc4388a5abbd822132f2312f80dbff8eef6c94e1aefa490ab6',
    };

    // Publish a message
    const publication = await broker.publish('explorer_publisher', sendMessage);
    publication.on('error', console.error);

    // Consume a message
    const subscription = await broker.subscribe('demo_subscription');
    subscription
      .on('message', (message, content, ackOrNack) => {
        console.log(content);
        ackOrNack();
      })
      .on('error', console.error);
  } catch (err) {
    console.error(err);
  }
}
