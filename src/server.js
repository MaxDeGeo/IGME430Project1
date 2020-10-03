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
    '/htmlScripts.js': responseHandler.getHTMLScript,
    '/apiScripts.js': responseHandler.getAPIScript,
    '/getTasks': responseHandler.getTasks,
    '/getTask': responseHandler.getTask,
    notFound: responseHandler.notFoundGet,
  },
  HEAD: {
    '/getTasks': responseHandler.getTasksMeta,
    '/getTask': responseHandler.getTaskMeta,
    notFound: responseHandler.notFoundMeta,
  },
  POST: {
    '/addTask': responseHandler.addTask,
    '/addColumn': responseHandler.addColumn,
    '/updateColumn': responseHandler.updateColumn,
    '/updateTask': responseHandler.updateTask,
    '/removeTask': responseHandler.removeTask,
    '/addComment': responseHandler.addComment,
    '/updateComment': responseHandler.updateComment,
    '/removeComment': responseHandler.removeComment,
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
      } else if (parsedURL.pathname === '/addColumn') {
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
      } else if (parsedURL.pathname === '/updateColumn') {
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

          responseHandler.updateColumn(request, response, bodyParams);
        });
      } else if (parsedURL.pathname === '/updateTask') {
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

          responseHandler.updateTask(request, response, bodyParams);
        });
      } else if (parsedURL.pathname === '/addComment') {
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

          responseHandler.addComment(request, response, bodyParams);
        });
      } else if (parsedURL.pathname === '/updateComment') {
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

          responseHandler.updateComment(request, response, bodyParams);
        });
      } else if (parsedURL.pathname === '/removeComment') {
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

          responseHandler.removeComment(request, response, bodyParams);
        });
      } else if (parsedURL.pathname === '/removeTask') {
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

          responseHandler.removeTask(request, response, bodyParams);
        });
      } else {
        urlStruct[request.method].notFound(request, response);
      }
    } else {
      urlStruct[request.method][parsedURL.pathname](request, response, parsedURL.query);
    }
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
