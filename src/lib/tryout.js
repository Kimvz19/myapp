import { fetchPosts } from "../lib/apiUtil.js";

// variabelen
let actualTimePeriod = []; // The most current time period
let filteredPosts = []; // Filtered posts based on state and time period
let stateFilter = "hawaii"; // Default state, in lowercase to avoid case sensitivity
let dataFound = false; // To track if data is found

export let index1 = null; // Index for the first comparison
export let index2 = null; // Index for the second comparison

// Function to fetch the most current time period
async function displayTime() {
    try {
        // Fetch data from the API
        let data = await fetchPosts();

        // Find the most recent time_period
        let maxTimePeriod = Math.max(
            ...data.map((item) => Number(item.time_period)),
        );

        // Filter data based on the most recent time_period
        actualTimePeriod = data.filter(
            (item) => Number(item.time_period) === maxTimePeriod,
        );

        // Filter posts based on stateFilter (case insensitive comparison)
        filteredPosts = actualTimePeriod.filter(
            (post) =>
                post.state.toLowerCase() === stateFilter.toLowerCase(),
        );

        // Update the dataFound status
        dataFound = filteredPosts.length > 0;

        
    } catch (error) {
        console.error("Error fetching data:", error.message);
        filteredPosts = []; // Reset the filtered posts on error
        dataFound = false; // No data found on error
    }
}

// Call displayTime when the component is mounted
onMount(() => {
    displayTime();
});

// Function to display data for a specific index from filteredPosts
async function displayRange(personIndex) {
    if (personIndex >= 0 && personIndex < filteredPosts.length) {
        let selectedPost = filteredPosts[personIndex];
        return `
            <p><strong>Value:</strong> ${selectedPost.value}</p>
            <p><strong>Confidence Interval:</strong> ${selectedPost.confidence_interval}</p>
            <p><strong>Low CI:</strong> ${selectedPost.lowci}</p>
            <p><strong>High CI:</strong> ${selectedPost.highci}</p>
            <p><strong>Quartile Range:</strong> ${selectedPost.quartile_range}</p>
            <p><strong>Phase:</strong> ${selectedPost.phase}</p>
        `;
    } else {
        return "<p>Invalid index! Please select a valid index.</p>";
    }
}

// Function to compare two indexes in filteredPosts
async function compareIndexes() {
    index1 = selectedIndex1; // Updates the global variable
    index2 = selectedIndex2; // Updates the global variable
    let outputDiv = document.querySelector(".resultOutput");

    // Ensure that the indexes are valid numbers and within range
    let index1Valid = index1 >= 0 && index1 < filteredPosts.length;
    let index2Valid = index2 >= 0 && index2 < filteredPosts.length;

    if (index1Valid && index2Valid) {
        let result1 = await displayRange(index1);
        let result2 = await displayRange(index2);
    
        outputDiv.innerHTML = `
            <h2>Comparison of Index ${index1} and Index ${index2}</h2>
            <div><h3>Index ${index1}</h3>${result1}</div>
            <div><h3>Index ${index2}</h3>${result2}</div>
        `;
    } else {
        outputDiv.innerHTML = "<p>One or both indexes are invalid!</p>";
    }
}

    // Exported function to get the details of a person based on their index
    export async function getPersonDetails(personIndex) {
    return await displayRange(personIndex);
}

// You can log the results here to test
console.log(getPersonDetails(index1));
console.log(displayRange(index1));