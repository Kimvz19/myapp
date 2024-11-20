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






<!-- state button try out -->
<div class="dropdown">
    <button class="dropdown-button">Data Talen</button>
    <div class="dropdown-content">
        <input type="text" id="search-data" class="dropdown-search" placeholder="Zoek een taal...">
        <li>kim</li>
        <li>kim</li>
        <li>kim</li>
    </div>
</div>




<!-- styling-->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap" rel="stylesheet">

<style>

.dropdown {
    position: relative;
    display: inline-block;
    margin-right: 20px;
}
.dropdown-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 5px;
}

.dropdown-content li {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

.dropdown-search {
    width: 100%;
    padding: 10px;
    margin: 0;
    border: none;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
}

/* Hover effect voor de links in het dropdown menu */
.dropdown-content a:hover {
    background-color: #f1f1f1;
}

/* Toon het dropdown menu wanneer de knop wordt ingedrukt */
.dropdown.show .dropdown-content {
    display: block;
}



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