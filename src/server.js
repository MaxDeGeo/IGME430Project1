const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': responseHandler.getIndex,
    '/styles.css': responseHandler.getCSS,
    '/logo.png': responseHandler.getLogo,
    '/background.jpeg': responseHandler.getBackground,
    '/getTasks': responseHandler.getTasks,
    '/getTask': responseHandler.getTask,
    // notFound: responseHandler.notFound,
  },
  // HEAD: {
  //   '/getUsers': responseHandler.getUsersMeta,
  //   notFound: responseHandler.notFoundMeta,
  // },
  POST: {
    '/addTask': responseHandler.addTask,
    '/addColumn': responseHandler.addColumn,
  },
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);
  if (urlStruct[request.method][parsedURL.pathname]) {
    if (request.method === 'POST') {
      if (parsedURL.pathname === '/addTask') {
        const body = [];

        request.on('error', (err) => {
          console.dir(err);
          response.statusCode = 400;
          response.end();
        });

        request.on('data', (chunk) => {
          body.push(chunk);
        });

        request.on('end', () => {
          const bodyString = Buffer.concat(body).toString();
          const bodyParams = query.parse(bodyString);

          responseHandler.addTask(request, response, bodyParams);
        });
      } else {
        const body = [];

        request.on('error', (err) => {
          console.dir(err);
          response.statusCode = 400;
          response.end();
        });

        request.on('data', (chunk) => {
          body.push(chunk);
        });

        request.on('end', () => {
          const bodyString = Buffer.concat(body).toString();
          const bodyParams = query.parse(bodyString);

          responseHandler.addColumn(request, response, bodyParams);
        });
      }
    } else {
      urlStruct[request.method][parsedURL.pathname](request, response, parsedURL.query);
    }
  } else {
    // urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
