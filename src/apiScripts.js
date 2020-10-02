// const handleResponse = (e, xhr, type, col) => {
//   // console.log(xhr.response);
//   // getTasks(e);
//   const modal = document.querySelector('#card-full-view');

//   if (type && type === 'modal') {
//     const task = JSON.parse(e.target.response);

//     modal.dataset.activeid = task.id;
//     modal.dataset.activecol = col;
//     modal.children[0].children[0].children[0].value = task.title;
//     modal.children[0].children[1].children[0].children[1].value = task.desc;

//     const { comments } = task;
//     clearComments();
//     for (let i = comments.length - 1; i >= 0; i--) {
//       createComment(comments[i]);
//     }
//   }
// };

// const getInfo = (e, col, id) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('get', `/getTask?column=${col}&task=${id}`);
//   xhr.setRequestHeader('Accept', 'application/json');
//   // console.log(xhr);
//   xhr.onload = (e) => handleResponse(e, xhr, 'modal', col);
//   xhr.send();
//   e.preventDefault();

//   openModal(e);

//   return false;
// };

// // TASK REQUESTS

// const getTasks = (e) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('get', '/getTasks');
//   xhr.setRequestHeader('Accept', 'application/json');

//   xhr.onload = () => setupPage(xhr);
//   xhr.send();
//   e.preventDefault();
// };

// const sendTask = (e) => {
//   if ((e.target.parentElement.parentElement.children[1].lastChild.children[0].value).trim() !== '') {
//     e.preventDefault();
//     const xhr = new XMLHttpRequest();
//     xhr.open('post', '/addTask');

//     xhr.setRequestHeader('Accept', 'application/json');
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     xhr.onload = () => {
//       handleResponse(xhr, true);

//       clearPage();
//       getTasks(e);
//     };

//     const { col } = e.target.parentElement.parentElement.dataset;
//     const title = e.target.parentElement.parentElement.children[1].lastChild.children[0].value;
//     const formData = `column=${col}&title=${title}`;
//     xhr.send(formData);
//   }

//   return false;
// };

// const updateTask = (e) => {
//   const modal = document.querySelector('#card-full-view');

//   if (e.target.value !== '') {
//     e.preventDefault();
//     const xhr = new XMLHttpRequest();
//     xhr.open('post', '/updateTask');

//     xhr.setRequestHeader('Accept', 'application/json');
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     xhr.onload = () => {
//       handleResponse(xhr, true);

//       clearPage();
//       getTasks(e);
//     };

//     const colNum = modal.dataset.activecol;
//     const taskId = modal.dataset.activeid;
//     const taskTitle = modal.children[0].children[0].children[0].value;
//     const taskDesc = modal.children[0].children[1].children[0].children[1].value;

//     const formData = `colNum=${colNum}&taskId=${taskId}&taskTitle=${taskTitle}&taskDesc=${taskDesc}`;
//     xhr.send(formData);
//   } else {
//     const id = modal.dataset.activeid;
//     const col = modal.dataset.activecol;
//     getInfo(e, col, id);
//   }

//   return false;
// };

// // COLUMN REQUESTS

// const sendColumn = (e) => {
//   if ((e.target.parentElement.parentElement.children[0].value).trim() !== '') {
//     e.preventDefault();
//     const xhr = new XMLHttpRequest();
//     xhr.open('post', '/addColumn');

//     xhr.setRequestHeader('Accept', 'application/json');
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     xhr.onload = () => {
//       handleResponse(xhr, true);

//       clearPage();
//       getTasks(e);
//     };

//     const col = e.target.parentElement.parentElement.children[0].value;
//     // console.log(col);
//     const formData = `column=${col}`;
//     xhr.send(formData);
//   }

//   return false;
// };

// const updateColumn = (e) => {
//   if (e.target.value !== '') {
//     e.preventDefault();
//     const xhr = new XMLHttpRequest();
//     xhr.open('post', '/updateColumn');

//     xhr.setRequestHeader('Accept', 'application/json');
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     xhr.onload = () => {
//       handleResponse(xhr, true);

//       clearPage();
//       getTasks(e);
//     };

//     const colTitle = e.target.value;
//     const colNum = e.target.parentElement.parentElement.parentElement.dataset.col;
//     const formData = `colNum=${colNum}&colTitle=${colTitle}`;
//     xhr.send(formData);
//   } else {
//     // console.log("OUT");
//     clearPage();
//     getTasks(e);
//   }

//   return false;
// };

// // COMMENT REQUESTS

// const sendComment = (e) => {
//   const text = document.querySelector('.addComment').value;
//   // console.log(text);
//   if (text.trim() !== '') {
//     e.preventDefault();
//     const xhr = new XMLHttpRequest();
//     xhr.open('post', '/addComment');

//     xhr.setRequestHeader('Accept', 'application/json');
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     xhr.onload = () => {
//       handleResponse(xhr, true, 'comments');

//       clearPage();
//       getTasks(e);
//       getInfo(e, modal.dataset.activecol, modal.dataset.activeid);
//     };
//     let modal = document.querySelector('#card-full-view');

//     const col = modal.dataset.activecol;
//     const id = modal.dataset.activeid;

//     hideAddComment();
//     const formData = `col=${col}&id=${id}&text=${text}`;
//     xhr.send(formData);
//   }

//   return false;
// };

// const editComment = (e) => {
//   e.target.parentElement.style.display = 'none';
//   const parent = e.target.parentElement.parentElement.children[0];
//   const text = e.target.parentElement.parentElement.children[0].children[1];
//   parent.removeChild(text);

//   const tempText = text.innerHTML;
//   const input = document.createElement('input');
//   input.classList.add('commentTextInput');
//   input.onblur = (e) => updateComment(e);
//   input.value = tempText;
//   input.focus();
//   parent.appendChild(input);
// };

// const updateComment = (e) => {
//   const footer = e.target.parentElement.parentElement.children[1];
//   footer.style.display = 'flex';

//   const text = e.target.value;

//   if (text.trim() !== '') {
//     e.preventDefault();
//     const xhr = new XMLHttpRequest();
//     xhr.open('post', '/updateComment');

//     xhr.setRequestHeader('Accept', 'application/json');
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     xhr.onload = () => {
//       handleResponse(e, xhr, true, 'comments');

//       clearPage();
//       getTasks(e);
//       getInfo(e, modal.dataset.activecol, modal.dataset.activeid);
//     };
//     let modal = document.querySelector('#card-full-view');

//     const col = modal.dataset.activecol;
//     const id = modal.dataset.activeid;
//     const { cid } = e.target.parentElement.parentElement.dataset;
//     // console.log(col);

//     const parent = e.target.parentElement;

//     const commentText = document.createElement('p');
//     commentText.classList.add('commentText');
//     commentText.innerHTML = text;

//     parent.removeChild(e.target);
//     parent.appendChild(commentText);

//     const formData = `col=${col}&id=${id}&cid=${cid}&text=${text}`;
//     xhr.send(formData);
//   }

//   return false;
// };

// const deleteComment = (e) => {
//   const comment = e.target.parentElement.parentElement;

//   e.preventDefault();
//   const xhr = new XMLHttpRequest();
//   xhr.open('post', '/removeComment');

//   xhr.setRequestHeader('Accept', 'application/json');
//   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//   xhr.onload = () => {
//     handleResponse(e, xhr, true, 'modal');

//     clearPage();
//     getTasks(e);
//     getInfo(e, modal.dataset.activecol, modal.dataset.activeid);
//   };
//   let modal = document.querySelector('#card-full-view');

//   const col = modal.dataset.activecol;
//   const id = modal.dataset.activeid;
//   const { cid } = e.target.parentElement.parentElement.dataset;

//   const formData = `col=${col}&id=${id}&cid=${cid}`;
//   xhr.send(formData);

//   return false;
// };
