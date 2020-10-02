const fs = require('fs');

const database = {
  columns: [
    {
      tasks: [
        {
          id: 0,
          title: 'test',
          desc: 'test desc',
          comments: [
            {
              id: 0,
              date: '9/29/2020',
              text: 'This is a test comment',
            },
            {
              id: 1,
              date: '9/28/2020',
              text: 'This is a test comment',
            },
            {
              id: 2,
              date: '9/27/2020',
              text: 'This is a test comment',
            },
            {
              id: 3,
              date: '9/26/2020',
              text: 'This is a test comment',
            },
          ],
        },
        {
          id: 1,
          title: 'test',
          desc: 'test desc',
          comments: [],
        },
        {
          id: 2,
          title: 'test',
          desc: 'test desc',
          comments: [],
        },
        {
          id: 3,
          title: 'test',
          desc: 'test desc',
          comments: [],
        },
        {
          id: 4,
          title: 'test',
          desc: 'test desc',
          comments: [],
        },
        {
          id: 5,
          title: 'test',
          desc: 'test desc',
          comments: [],
        },
        {
          id: 6,
          title: 'test',
          desc: 'test desc',
          comments: [],
        },
        {
          id: 7,
          title: 'test',
          desc: 'test desc',
          comments: [],
        },
        {
          id: 8,
          title: 'test',
          desc: 'test desc',
          comments: [],
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
          comments: [],
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
const htmlScripts = fs.readFileSync(`${__dirname}/htmlScripts.js`);
const apiScripts = fs.readFileSync(`${__dirname}/apiScripts.js`);

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const respondMeta = (request, response, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.end();
};

// Routes
const getIndex = (request, response) => respond(request, response, 200, index, 'text/html');

const getCSS = (request, response) => respond(request, response, 200, css, 'text/css');

const getLogo = (request, response) => respond(request, response, 200, logo, 'image/png');

const getBackground = (request, response) => respond(request, response, 200, background, 'image/jpeg');

const getHTMLScript = (request, response) => respond(request, response, 200, htmlScripts, 'text/javascript');

const getAPIScript = (request, response) => respond(request, response, 200, apiScripts, 'text/javascript');

// GET
const getTasks = (request, response) => respond(request, response, 200, JSON.stringify(database), 'application/json');

const getTask = (request, response, params) => {
  const col = params.substring(params.indexOf('=') + 1, params.indexOf('&'));
  const id = params.substring(params.lastIndexOf('=') + 1, params.length);

  const json = database.columns[col].tasks[id];
  return respond(request, response, 200, JSON.stringify(json), 'application/json');
};

// HEAD
const getTasksMeta = (request, response) => respondMeta(request, response, 200, 'application/json');
const getTaskMeta = (request, response) => respondMeta(request, response, 200, 'application/json');

// POST
const addTask = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };

  let col = null;
  let text = null;

  if (params.column && params.title) {
    col = params.column;
    text = params.title;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }

  const newId = database.columns[col].tasks.length;
  database.columns[col].tasks.push({
    id: newId, title: text, desc: '', comments: [],
  });

  responseJson.message = 'Task Created!';
  return respond(request, response, 201, JSON.stringify(responseJson), 'application/json');
};

const addColumn = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };

  let colTitle = null;
  if (params.column) {
    colTitle = params.column;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }

  database.columns.push({ tasks: [], name: colTitle });

  responseJson.message = 'Column Created!';
  return respond(request, response, 201, JSON.stringify(responseJson), 'application/json');
};

const updateColumn = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };
  let colTitle = null;
  let colNum = null;

  if (params.colTitle && params.colNum) {
    colTitle = params.colTitle;
    colNum = params.colNum;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }

  database.columns[colNum].name = colTitle;

  responseJson.message = 'Column Updated!';
  return respond(request, response, 201, JSON.stringify(responseJson), 'application/json');
};

const updateTask = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };

  let taskCol = null;
  let taskId = null;
  let taskTitle = null;
  let taskDesc = null;

  if (params.colNum && params.taskId && params.taskTitle && params.taskDesc) {
    taskCol = params.colNum;
    taskId = params.taskId;
    taskTitle = params.taskTitle;
    taskDesc = params.taskDesc;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }

  database.columns[taskCol].tasks[taskId] = {
    id: taskId,
    title: taskTitle,
    desc: taskDesc,
    comments: database.columns[taskCol].tasks[taskId].comments,
  };

  responseJson.message = 'Task Updated!';
  return respond(request, response, 201, JSON.stringify(responseJson), 'application/json');
};

const addComment = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };

  let col = null;
  let id = null;
  let cText = null;

  if (params.col && params.id && params.text) {
    col = params.col;
    id = params.id;
    cText = params.text;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }
  const date = new Date();
  const cDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  database.columns[col].tasks[id].comments.push({
    id: database.columns[col].tasks[id].comments.length, date: cDate, text: cText,
  });

  responseJson.message = 'Comment Created!';
  return respond(request, response, 201, JSON.stringify(responseJson), 'application/json');
};

const updateComment = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };

  let col = null;
  let id = null;
  let cid = null;
  let cText = null;

  if (params.col && params.id && params.cid && params.text) {
    col = params.col;
    id = params.id;
    cid = params.cid;
    cText = params.text;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }
  const date = new Date();
  const cDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  database.columns[col].tasks[id].comments[cid] = {
    id: cid,
    date: cDate,
    text: cText,
  };

  responseJson.message = 'Commented Updated!';
  return respond(request, response, 201, JSON.stringify(responseJson), 'application/json');
};

const removeComment = (request, response, params) => {
  const responseJson = {
    message: 'missingParams',
  };

  let col = null;
  let id = null;
  let cid = null;

  if (params.col && params.id && params.cid) {
    col = params.col;
    id = params.id;
    cid = params.cid;
  } else {
    return respond(request, response, 400, JSON.stringify(responseJson), 'application/json');
  }

  database.columns[col].tasks[id].comments.splice(cid, 1);
  // database.columns[col].tasks[id].comments[cid] = {
  //   id: cid,
  //   date: cDate,
  // };

  for (let i = 0; i < database.columns[col].tasks[id].comments.length; i++) {
    database.columns[col].tasks[id].comments[i].id = i;
  }

  responseJson.message = 'Commented Updated!';
  return respond(request, response, 201, JSON.stringify(responseJson), 'application/json');
};

// ERROR
const notFound = (request, response) => respondMeta(request, response, 404, 'application/json');

module.exports = {
  getIndex,
  getCSS,
  getLogo,
  getBackground,
  getHTMLScript,
  getAPIScript,
  getTasks,
  getTasksMeta,
  getTask,
  getTaskMeta,
  addTask,
  updateTask,
  addColumn,
  updateColumn,
  addComment,
  updateComment,
  removeComment,
  notFound,
};
