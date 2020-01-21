import { ApolloServer } from 'apollo-server-express';
import ApollosConfig from '@apollosproject/config';
import express from 'express';
import { RockLoggingExtension } from '@apollosproject/rock-apollo-data-source';
import { get } from 'lodash';

import {
  resolvers,
  schema,
  testSchema,
  context,
  dataSources,
  applyServerMiddleware,
  setupJobs,
} from './data';
import { report } from './data/bugsnag';

export { resolvers, schema, testSchema };

const isDev =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';

const extensions = isDev ? [() => new RockLoggingExtension()] : [];

const cacheOptions = isDev
  ? {}
  : {
      cacheControl: {
        stripFormattedExtensions: false,
        calculateHttpHeaders: true,
        defaultMaxAge: 600,
      },
    };

const { ENGINE } = ApollosConfig;

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources,
  context: ({ req, res, ...args }) => {
    res.set('Vary', 'X-Campus');
    return context({ req, res, ...args });
  },
  introspection: true,
  extensions,
  debug: true,
  formatError: (error) => {
    report(
      error,
      {
        'GraphQL Info': { path: error.path },
        'Custom Stacktrace': {
          trace: get(error, 'extensions.exception.stacktrace', []).join('\n'),
        },
      },
      (err) => {
        err.errorClass = error.message;
      }
    );
    if (get(error, 'extensions.exception.stacktrace')) {
      delete error.extensions.exception.stacktrace;
    }
    return error;
  },
  playground: {
    settings: {
      'editor.cursorShape': 'line',
    },
  },
  ...cacheOptions,
  engine: {
    apiKey: ENGINE.API_KEY,
    schemaTag: ENGINE.SCHEMA_TAG,
  },
});

const app = express();

applyServerMiddleware({ app, dataSources, context });
setupJobs({ app, dataSources, context });

app.get('/.well-known/apple-app-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      applinks: {
        apps: [],
        details: [
          {
            appID: ApollosConfig.APP.APPLE_APP_ID,
            paths: ['/apollos/*'],
          },
        ],
      },
    })
  );
});

app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(
    JSON.stringify([
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android',
          package_name: ApollosConfig.APP.ANDROID_APP_ID,
          sha256_cert_fingerprints: [ApollosConfig.APP.GOOGLE_KEYSTORE_SHA256],
        },
      },
    ])
  );
});

apolloServer.applyMiddleware({ app });
apolloServer.applyMiddleware({ app, path: '/' });

export default app;
