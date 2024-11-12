// Import the apiUtil.js module with the exported functions.
import { fetchPosts } from "../lib/apiUtil";

// Display only the first 5 post title and body.
async function displayPosts() {
  try {

    
    // Await the result of the async fetchPosts function
    const posts = await fetchPosts();

    // Slice the first 5 posts and display title and body
    posts.slice(0, 5).forEach((post) => {
      // console.log(`indicator: ${post.indicator}`);
      console.log(`group: ${post.group}`);
    });


  } catch (error) {
    console.error("Error displaying posts:", error.message);
  }
}

displayPosts();