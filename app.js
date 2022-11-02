// === Variables ===
const filterHTML = document.querySelector(".filter");
const postsHTML = document.querySelector(".posts");
const loading = document.querySelector(".loading");

const limit = 5;
let page = 1;

// === Initial show posts ===
showPosts();

// === Event Listeners ===

// filter posts
filterHTML.addEventListener("keyup", filterPosts);

// Toggle Comments on Click
postsHTML.addEventListener("click", toggleComments);

// scroll: show loading
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (!filterHTML.value && scrollTop + clientHeight >= scrollHeight - 50) {
    showLoading();
  }
});

// === Functions ===

// Filter posts
function filterPosts(e) {
  const searchInput = e.target.value.trim().toLowerCase();

  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    const title = post.querySelector(".post__title").innerText.toLowerCase();
    const body = post.querySelector(".post__body").innerText.toLowerCase();

    if (title.indexOf(searchInput) > -1 || body.indexOf(searchInput) > -1) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
}

// Get Posts from API
async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  const data = await res.json();
  return data;
}

// Get Comments in posts
async function getComments(postId) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  const data = await res.json();
  return data;
}

// DOM: Show Posts
async function showPosts() {
  const posts = await getPosts();

  posts.forEach((post) => {
    const postHTML = document.createElement("div");
    postHTML.classList.add("post");
    postHTML.setAttribute("post-id", post.id);
    postHTML.innerHTML = `
      <h3 class="post__title">${post.title}</h3>
      <div class="post__body">${post.body}</div>
      <div class="btn btn--comments">
       <div class="triangle triangle--right"></div>
        Comments:
    `;
    postsHTML.appendChild(postHTML);
  });
}

// DOM: Show Comments
async function showComments(postId) {
  const comments = await getComments(postId);
  const allPosts = postsHTML.querySelectorAll(".post");
  let currentPost;
  allPosts.forEach((post) => {
    if (post.getAttribute("post-id") === postId) {
      currentPost = post;
    }
  });

  const commentsHTML = document.createElement("div");
  commentsHTML.className = "comments";

  comments.forEach((comment) => {
    commentsHTML.innerHTML += `
      <div class="comment">
        <div class="comment__body"> ${comment.body}</div>
        <div class="comment__author">${comment.email}</div>
      </div>`;
  });
  currentPost.appendChild(commentsHTML);
}

// Toggle Comments on Click
function toggleComments(e) {
  let postId;
  if (e.target.classList.contains("btn--comments--open")) {
    e.target.classList.remove("btn--comments--open");
    e.target.querySelector(".triangle").classList.toggle("triangle--right");
    e.target.querySelector(".triangle").classList.toggle("triangle--down");
    e.target.nextElementSibling.remove();
  } else if (
    e.target.classList.contains("btn--comments") &&
    !e.target.classList.contains("btn--comments--open")
  ) {
    e.target.classList.add("btn--comments--open");
    e.target.querySelector(".triangle").classList.toggle("triangle--right");
    e.target.querySelector(".triangle").classList.toggle("triangle--down");
    postId = e.target.parentNode.getAttribute("post-id");
    showComments(postId);
  }

  if (e.target.classList.contains("triangle--right")) {
    e.target.classList.toggle("triangle--right");
    e.target.classList.toggle("triangle--down");
    e.target.parentNode.parentNode.classList.add("btn--comments--open");
    postId = e.target.parentNode.parentNode.getAttribute("post-id");
    showComments(postId);
  } else if (e.target.classList.contains("triangle--down")) {
    e.target.classList.toggle("triangle--down");
    e.target.classList.toggle("triangle--right");
    e.target.parentNode.nextElementSibling.remove();
  }
}

// Show loader on scroll
function showLoading() {
  loading.classList.add("show");

  setTimeout(() => {
    loading.classList.remove("show");

    setTimeout(() => {
      page++;
      showPosts();
    }, 100);
  }, 1000);
}
