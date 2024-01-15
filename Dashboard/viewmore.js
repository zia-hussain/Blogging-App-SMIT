const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('blogId');

// Now, you can use the blogId as needed in your viewmore.html page
console.log(blogId);