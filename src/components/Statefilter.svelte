<script>
    // Import the function to fetch posts from the specified path
    import { onMount } from "svelte";
    import { fetchPosts } from "../lib/apiUtil.js";
    let filteredPosts = [];
    let stateFilter = "Hawaii";

    onMount(async () => {
        await displayPosts(stateFilter);
    });


    async function displayPosts(stateFilter) {
        try {
            // Fetch the data from the API
            let posts = await fetchPosts();

    
            // Filter the posts by the specified state
            filteredPosts = posts.filter((post) => post.state === stateFilter);

            // filteredPosts = posts.filter((post) => post
            // .state === stateFilter && post
            // .age > 15 && post.age < 30);


            console.log(filteredPosts); // Log the filtered posts

        //error prevention
        } catch (error) {
            console.error("Error displaying posts:", error.message);
            filteredPosts = []; // In case of error, reset the filtered posts
        }
    }
    console.log(filteredPosts); 

    //uitvoering function
    displayPosts(stateFilter);
</script>

<!-- html code-->
<div>
    <p>Gegevens in {stateFilter}</p>

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




<!-- styling-->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap" rel="stylesheet">

<style>
div,button, input{
    font-family: "Montserrat";
      font-optical-sizing: auto;
      font-weight: 200;
      font-style: normal;
      font-size: 20px;
      margin-left: 10px;
}

button, input{
    border-radius: 5px;

}

</style>