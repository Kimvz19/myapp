// Write a module that fetches a dataset e.g. 'fake' posts from Json Placeholder. https://jsonplaceholder.typicode.com/posts Use async await, use fetch.
async function fetchPosts() {
  const url = "https://data.cdc.gov/resource/8pt5-q6wp.json?$limit=1000&$offset=16300";

  try {
    const response = await fetch(url); //om url fetch response
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;  
  
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

// Export the functions using named exports.
export { fetchPosts };


