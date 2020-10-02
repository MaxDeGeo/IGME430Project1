const handleResponse = (e, xhr, type, col) => {
  // console.log(xhr.response);
  // getTasks(e);
  const modal = document.querySelector('#card-full-view');

  if (type && type === 'modal') {
    const task = JSON.parse(e.target.response);

    modal.dataset.activeid = task.id;
    modal.dataset.activecol = col;
    modal.children[0].children[0].children[0].value = task.title;
    modal.children[0].children[1].children[0].children[1].value = task.desc;

    const { comments } = task;
    clearComments();
    for (let i = comments.length - 1; i >= 0; i--) {
      createComment(comments[i]);
    }
  }
};

const getInfo = (e, col, id) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', `/getTask?column=${col}&task=${id}`);
  xhr.setRequestHeader('Accept', 'application/json');
  // console.log(xhr);
  xhr.onload = (e) => handleResponse(e, xhr, 'modal', col);
  xhr.send();
  e.preventDefault();

  openModal(e);

  return false;
};

// TASK REQUESTS

const getTasks = (e) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/getTasks');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => setupPage(xhr);
  xhr.send();
  e.preventDefault();
};

const sendTask = (e) => {
  if ((e.target.parentElement.parentElement.children[1].lastChild.children[0].value).trim() !== '') {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/addTask');

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
      handleResponse(xhr, true);

      clearPage();
      getTasks(e);
    };

    const { col } = e.target.parentElement.parentElement.dataset;
    const title = e.target.parentElement.parentElement.children[1].lastChild.children[0].value;
    const formData = `column=${col}&title=${title}`;
    xhr.send(formData);
  }

  return false;
};

const updateTask = (e) => {
  const modal = document.querySelector('#card-full-view');

  if (e.target.value !== '') {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/updateTask');

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
      handleResponse(xhr, true);

      clearPage();
      getTasks(e);
    };

    const colNum = modal.dataset.activecol;
    const taskId = modal.dataset.activeid;
    const taskTitle = modal.children[0].children[0].children[0].value;
    const taskDesc = modal.children[0].children[1].children[0].children[1].value;

    const formData = `colNum=${colNum}&taskId=${taskId}&taskTitle=${taskTitle}&taskDesc=${taskDesc}`;
    xhr.send(formData);
  } else {
    const id = modal.dataset.activeid;
    const col = modal.dataset.activecol;
    getInfo(e, col, id);
  }

  return false;
};

// COLUMN REQUESTS

const sendColumn = (e) => {
  if ((e.target.parentElement.parentElement.children[0].value).trim() !== '') {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/addColumn');

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
      handleResponse(xhr, true);

      clearPage();
      getTasks(e);
    };

    const col = e.target.parentElement.parentElement.children[0].value;
    // console.log(col);
    const formData = `column=${col}`;
    xhr.send(formData);
  }

  return false;
};

const updateColumn = (e) => {
  if (e.target.value !== '') {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/updateColumn');

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
      handleResponse(xhr, true);

      clearPage();
      getTasks(e);
    };

    const colTitle = e.target.value;
    const colNum = e.target.parentElement.parentElement.parentElement.dataset.col;
    const formData = `colNum=${colNum}&colTitle=${colTitle}`;
    xhr.send(formData);
  } else {
    // console.log("OUT");
    clearPage();
    getTasks(e);
  }

  return false;
};

// COMMENT REQUESTS

const sendComment = (e) => {
  const text = document.querySelector('.addComment').value;
  // console.log(text);
  if (text.trim() !== '') {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/addComment');

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
      handleResponse(xhr, true, 'comments');

      clearPage();
      getTasks(e);
      getInfo(e, modal.dataset.activecol, modal.dataset.activeid);
    };
    let modal = document.querySelector('#card-full-view');

    const col = modal.dataset.activecol;
    const id = modal.dataset.activeid;

    hideAddComment();
    const formData = `col=${col}&id=${id}&text=${text}`;
    xhr.send(formData);
  }

  return false;
};

const editComment = (e) => {
  e.target.parentElement.style.display = 'none';
  const parent = e.target.parentElement.parentElement.children[0];
  const text = e.target.parentElement.parentElement.children[0].children[1];
  parent.removeChild(text);

  const tempText = text.innerHTML;
  const input = document.createElement('input');
  input.classList.add('commentTextInput');
  input.onblur = (e) => updateComment(e);
  input.value = tempText;
  input.focus();
  parent.appendChild(input);
};

const updateComment = (e) => {
  const footer = e.target.parentElement.parentElement.children[1];
  footer.style.display = 'flex';

  const text = e.target.value;

  if (text.trim() !== '') {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/updateComment');

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
      handleResponse(e, xhr, true, 'comments');

      clearPage();
      getTasks(e);
      getInfo(e, modal.dataset.activecol, modal.dataset.activeid);
    };
    let modal = document.querySelector('#card-full-view');

    const col = modal.dataset.activecol;
    const id = modal.dataset.activeid;
    const { cid } = e.target.parentElement.parentElement.dataset;
    // console.log(col);

    const parent = e.target.parentElement;

    const commentText = document.createElement('p');
    commentText.classList.add('commentText');
    commentText.innerHTML = text;

    parent.removeChild(e.target);
    parent.appendChild(commentText);

    const formData = `col=${col}&id=${id}&cid=${cid}&text=${text}`;
    xhr.send(formData);
  }

  return false;
};

const deleteComment = (e) => {
  const comment = e.target.parentElement.parentElement;

  e.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open('post', '/removeComment');

  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = () => {
    handleResponse(e, xhr, true, 'modal');

    clearPage();
    getTasks(e);
    getInfo(e, modal.dataset.activecol, modal.dataset.activeid);
  };
  let modal = document.querySelector('#card-full-view');

  const col = modal.dataset.activecol;
  const id = modal.dataset.activeid;
  const { cid } = e.target.parentElement.parentElement.dataset;

  const formData = `col=${col}&id=${id}&cid=${cid}`;
  xhr.send(formData);

  return false;
};

const openModal = (e) => {
  const modal = document.querySelector('#card-full-view');
  const modalDesc = document.querySelector('#card-full-description');
  // console.log(modalDesc.style.height);
  modalDesc.style.height = `${25 + modalDesc.scrollHeight}px !important`;
  modal.style.display = 'block';
  modal.children[0].children[0].children[0].value = e.target.innerHTML;
};

const closeModal = (e) => {
  e.target.parentElement.parentElement.parentElement.activecol = -1;
  e.target.parentElement.parentElement.parentElement.activeid = -1;
  e.target.parentElement.parentElement.parentElement.style.display = 'none';
};

const setupPage = (xhr) => {
  const json = JSON.parse(xhr.response);
  const listContainer = document.querySelector('#list-container');

  for (let i = 0; i < json.columns.length; i++) {
    const list = document.createElement('div');
    list.dataset.col = i;
    list.classList.add('list');

    // Head section
    const listHead = document.createElement('div');
    listHead.classList.add('list-head');

    const listTitle = document.createElement('div');
    listTitle.classList.add('list-title');
    listHead.appendChild(listTitle);

    const listInput = document.createElement('input');
    listInput.classList.add('title-input');
    listInput.value = json.columns[i].name;
    listInput.onblur = (e) => updateColumn(e);
    listTitle.appendChild(listInput);

    list.appendChild(listHead);

    // Body section
    const listBody = document.createElement('div');
    listBody.classList.add('list-body');

    for (let j = 0; j < json.columns[i].tasks.length; j++) {
      const task = document.createElement('div');
      task.classList.add('task');
      task.dataset.id = j;
      task.onclick = (e) => getInfo(e, i, json.columns[i].tasks[j].id);
      const taskText = document.createElement('div');
      taskText.classList.add('created-task-title');
      taskText.innerHTML = json.columns[i].tasks[j].title;
      task.appendChild(taskText);

      listBody.appendChild(task);
    }
    list.appendChild(listBody);

    // Footer
    const addContainer = document.createElement('div');
    addContainer.classList.add('add-task-container');

    const taskButton = document.createElement('div');
    taskButton.classList.add('add-task-button');
    taskButton.onclick = (e) => newTask(e);
    addContainer.appendChild(taskButton);

    const buttonText = document.createElement('div');
    buttonText.classList.add('add-task-text');
    taskButton.appendChild(buttonText);

    const plus = document.createElement('div');
    plus.innerHTML = '+';

    buttonText.appendChild(plus);
    const text = document.createElement('div');
    text.innerHTML = 'Add a task';
    buttonText.appendChild(text);

    list.appendChild(addContainer);
    listContainer.appendChild(list);
  }

  createNewListButton(listContainer);
};

const createNewListButton = (listContainer) => {
  const newList = document.createElement('div');
  newList.id = 'newList';

  const listText = document.createElement('div');
  listText.innerHTML = 'Add a list';
  listText.classList.add('addListButton');
  newList.appendChild(listText);
  newList.onclick = (e) => createColumn(e);

  listContainer.appendChild(newList);
};

const newTask = (e) => {
  const list = e.target.closest('.list').children[1];

  // list.scrollTop = "100";

  const taskContainer = document.createElement('div');
  taskContainer.classList.add('task');

  const taskText = document.createElement('textarea');
  taskText.placeholder = 'Enter a title for this task...';
  taskText.classList.add('task-title');
  taskContainer.appendChild(taskText);

  list.appendChild(taskContainer);

  const listFooter = list.parentElement.children[2];

  while (listFooter.firstChild) {
    listFooter.removeChild(listFooter.firstChild);
  }

  createFooter(listFooter);
};

const createFooter = (footerContainer) => {
  footerContainer.classList = '';
  footerContainer.classList.add('add-task-flex');

  const button = document.createElement('div');
  button.classList.add('add-task');
  button.innerHTML = 'Add Task';
  button.onclick = (e) => sendTask(e);
  footerContainer.appendChild(button);

  const cancel = document.createElement('div');
  cancel.classList.add('cancel-task');
  cancel.innerHTML = 'x';
  cancel.onclick = (e) => cancelTask(e);
  footerContainer.appendChild(cancel);
};

const cancelTask = (e) => {
  const list = e.target.closest('.list');
  const listBody = list.children[1];
  const addContainer = e.target.closest('.list').children[2];
  addContainer.classList = '';

  while (addContainer.firstChild) {
    addContainer.removeChild(addContainer.firstChild);
  }

  addContainer.classList.add('add-task-container');

  const taskButton = document.createElement('div');
  taskButton.classList.add('add-task-button');
  taskButton.onclick = () => newTask(e);
  addContainer.appendChild(taskButton);

  const buttonText = document.createElement('div');
  buttonText.classList.add('add-task-text');
  taskButton.appendChild(buttonText);

  const plus = document.createElement('div');
  plus.innerHTML = '+';

  buttonText.appendChild(plus);
  const text = document.createElement('div');
  text.innerHTML = 'Add a task';
  buttonText.appendChild(text);

  list.appendChild(addContainer);

  listBody.removeChild(listBody.lastChild);
};

const cancelAddColumn = () => {
  const list = document.querySelector('.addColBody');
  const listParent = list.parentElement;
  listParent.removeChild(list);

  createNewListButton(listParent);
};

const replaceAddColumn = () => {
  const list = document.querySelector('#newList');
  const listParent = list.parentElement;
  listParent.removeChild(list);

  const addColBody = document.createElement('div');
  addColBody.classList.add('addColBody');
  listParent.appendChild(addColBody);

  const colTitleInput = document.createElement('input');
  colTitleInput.classList.add('addColInput');
  addColBody.appendChild(colTitleInput);

  const footerContainer = document.createElement('div');
  footerContainer.classList = '';
  footerContainer.classList.add('add-task-flex');

  const button = document.createElement('div');
  button.classList.add('add-task');
  button.innerHTML = 'Add Column';
  button.onclick = (e) => sendColumn(e);
  footerContainer.appendChild(button);

  const cancel = document.createElement('div');
  cancel.classList.add('cancel-task');
  cancel.innerHTML = 'x';
  cancel.onclick = () => cancelAddColumn();
  footerContainer.appendChild(cancel);

  addColBody.appendChild(footerContainer);
};

const createColumn = (e) => {
  replaceAddColumn();
};

const clearPage = () => {
  const listCont = document.querySelector('#list-container');
  while (listCont.firstChild) {
    listCont.removeChild(listCont.firstChild);
  }
};

const clearComments = () => {
  const comments = document.querySelector('#card-comment-container');
  while (comments.firstChild) {
    comments.removeChild(comments.firstChild);
  }
};

const createComment = (comment) => {
  const commentContainer = document.createElement('div');
  commentContainer.classList.add('commentContainer');
  commentContainer.dataset.cid = comment.id;

  const commentBody = document.createElement('div');
  commentBody.classList.add('commentBody');
  commentContainer.appendChild(commentBody);

  const commentHead = document.createElement('div');
  commentHead.classList.add('commentHead');
  commentBody.appendChild(commentHead);

  const commentIcon = document.createElement('div');
  commentIcon.classList.add('commentIcon');
  commentHead.appendChild(commentIcon);

  const commentDate = document.createElement('h4');
  commentDate.classList.add('commentDate');
  commentHead.appendChild(commentDate);
  commentDate.innerHTML = comment.date;

  const commentText = document.createElement('p');
  commentText.classList.add('commentText');
  commentText.innerHTML = comment.text;
  commentBody.appendChild(commentText);

  const commentFooter = document.createElement('div');
  commentFooter.classList.add('commentFooter');

  const commentEdit = document.createElement('div');
  commentEdit.classList.add('subButtons');
  commentEdit.onclick = (e) => editComment(e);
  commentEdit.innerHTML = 'Edit';

  const commentDelete = document.createElement('div');
  commentDelete.onclick = (e) => deleteComment(e);
  commentDelete.classList.add('subButtons');
  commentDelete.innerHTML = 'Delete';

  commentFooter.appendChild(commentEdit);
  commentFooter.appendChild(commentDelete);
  commentContainer.appendChild(commentFooter);

  // return commentBody;

  const commentSec = document.querySelector('#card-comment-container');
  commentSec.appendChild(commentContainer);
};

const showAddComment = () => {
  const addButtons = document.querySelector('#addCommentContainer');
  addButtons.style.display = 'flex';
};

const hideAddComment = () => {
  const addButtons = document.querySelector('#addCommentContainer');
  addButtons.style.display = 'none';
  const commentInput = document.querySelector('.addComment');
  commentInput.value = '';
};
