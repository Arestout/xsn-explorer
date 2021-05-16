import { RABBITMQ_HOST } from './../../config/index';

export const config = {
  vhosts: {
    lsgwaoxk: {
      connection: {
        url: RABBITMQ_HOST,
        heartbeat: 1,
        socketOptions: {
          timeout: 1000,
        },
      },
      exchanges: ['transactions_exchange'],
      queues: ['ransactions_queue'],
      bindings: ['transactions_exchange[whale_transaction] -> transactions_queue', 'transactions_exchange[burn_transaction] -> transactions_queue'],
      publications: {
        explorer_publisher: {
          vhost: 'lsgwaoxk',
          exchange: 'transactions_exchange',
          routingKey: 'whale_transaction',
        },
      },
      subscriptions: {
        demo_subscription: {
          queue: 'transactions_queue',
          prefetch: 1,
        },
      },
    },
  },
};
