<script>
    // Import the function to fetch posts from the specified path
    import { fetchPosts } from "../lib/apiUtil.js";
    let filteredPosts = [];
    let stateFilter = "Hawaii";


    async function displayPosts(stateFilter) {
        try {
            // Fetch the data from the API
            let posts = await fetchPosts();

        

            // Filter the posts by the specified state
            filteredPosts = posts.filter((post) => post.state === stateFilter);

            console.log(filteredPosts); // Log the filtered posts

        //error prevention
        } catch (error) {
            console.error("Error displaying posts:", error.message);
            filteredPosts = []; // In case of error, reset the filtered posts
        }
    }

    //uitvoering function
    displayPosts(stateFilter);
</script>

<!-- html code-->
<div>
    <h2>Gegevens in {stateFilter}</h2>

<!-- inpur van de gebruiker zelf-->
<input
type="text"
bind:value={stateFilter}
placeholder="Enter state"
/>

<button on:click={() => displayPosts(stateFilter)}>Filter Posts</button>

    {#if filteredPosts.length > 0}
        <ul>
            {#each filteredPosts as post}
                <li>{post.indicator} - {post.state} - {post.confidence_interval}</li>
            {/each}
        </ul>
    {:else}
        <p>No posts found for {stateFilter}.</p>
    {/if}
</div>
