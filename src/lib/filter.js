import { fetchPosts } from "../lib/apiUtil";

// Display only the filtered data based on the state
async function displayPosts(stateFilter) {
    try {
        // Fetch the data from the API
        let post = await fetchPosts();

        // Filter the posts by the specified state
        const filteredPost = post.filter(post => post.state === stateFilter); 
        console.log(filteredPost.slice());

        return filteredPost;
    } catch (error) {
        console.error("Error displaying post:", error.message);
        return [];
    }
}

// Example call to displayPosts
displayPosts("Hawaii");



// // Import the apiUtil.js module with the exported functions.
// import { fetchPosts } from "../lib/apiUtil";

// /**
//  * Filters data based on multiple criteria.
//  * @param {Object} filters - An object with key-value pairs to filter by (e.g., { state: "United States", phase: "1" }).
//  * @returns {Promise<Array>} - A filtered list of posts.
//  */
// async function displayFilteredPosts(filters = {}) {
//   try {
//     // Fetch the data from the API
//     let posts = await fetchPosts();

//     // Filter posts dynamically based on the filters object
//     const filteredPosts = posts.filter(post => {
//       return Object.keys(filters).every(key => {
//         // Check if the key exists and matches the filter value
//         return post[key] && String(post[key]) === String(filters[key]);
//       });
//     });

//     // Return the filtered posts
//     return filteredPosts;
//   } catch (error) {
//     console.error("Error displaying filtered posts:", error.message);
//     return [];
//   }
// }

// // Example usage
// displayFilteredPosts({ 
//   state: "United States", 
//   phase: "1", 
// }).then(filteredList => {
//   console.log(filteredList); // Logs the filtered list
// });
