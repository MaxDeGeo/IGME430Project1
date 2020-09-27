const fs = require('fs');

const database = {
  columns: [
    {
      tasks: [
        {
          id: 0,
          title: 'test',
          desc: 'test desc',
        },
        {
          id: 1,
          title: 'test',
          desc: 'test desc',
        },
        {
          id: 2,
          title: 'test',
          desc: 'test desc',
        },
        {
          id: 3,
          title: 'test',
          desc: 'test desc',
        },
        {
          id: 4,
          title: 'test',
          desc: 'test desc',
        },
        {
          id: 5,
          title: 'test',
          desc: 'test desc',
        },
        {
          id: 6,
          title: 'test',
          desc: 'test desc',
        },
        {
          id: 7,
          title: 'test',
          desc: 'test desc',
        },
        {
          id: 8,
          title: 'test',
          desc: 'test desc',
        },
      ],
      name: 'Column 1',
    },
    {
      tasks: [
        {
          id: 0,
          title: 'test 2',
          desc: 'test desc',
        },
      ],
      name: 'Column 2',
    },
  ],
};

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const css = fs.readFileSync(`${__dirname}/../client/styles.css`);
const logo = fs.readFileSync(`${__dirname}/../images/logo.png`);
const background = fs.readFileSync(`${__dirname}/../images/background.jpeg`);

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// const respondMeta = (request, response, status, type) => {
//   response.writeHead(status, { 'Content-Type': type });
//   response.end();
// };

// Routes
const getIndex = (request, response) => respond(request, response, 200, index, 'text/html');

const getCSS = (request, response) => respond(request, response, 200, css, 'text/css');

const getLogo = (request, response) => respond(request, response, 200, logo, 'image/png');

const getBackground = (request, response) => respond(request, response, 200, background, 'image/jpeg');

// GET

const getTasks = (request, response) => respond(request, response, 200, JSON.stringify(database), 'application/json');

const getTask = (request, response, params) => {
  const col = params.substring(params.indexOf('=') + 1, params.indexOf('&'));
  const id = params.substring(params.lastIndexOf('=') + 1, params.length);

  const json = database.columns[col].tasks[id];
  return respond(request, response, 200, JSON.stringify(json), 'application/json');
};

// POST

const addTask = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };

  // console.log(params);
  let col = null;
  let text = null;

  if (params.column && params.title) {
    col = params.column;
    text = params.title;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }

  const newId = database.columns[col].tasks.length;
  database.columns[col].tasks.push({ id: newId, title: text, desc: '' });

  responseJson.message = 'Task Created!';
  return respond(request, response, 204, JSON.stringify(responseJson), 'application/json');
};

const addColumn = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };

  // console.log(params);
  let colTitle = null;
  if (params.column) {
    colTitle = params.column;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }

  database.columns.push({ tasks: [], name: colTitle });

  responseJson.message = 'Column Created!';
  return respond(request, response, 204, JSON.stringify(responseJson), 'application/json');
};

module.exports = {
  getIndex,
  getCSS,
  getLogo,
  getBackground,
  getTasks,
  getTask,
  addTask,
  addColumn,
};
