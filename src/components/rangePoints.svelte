<!-- <script>
    import { onMount } from "svelte";
    import { fetchPosts } from "../lib/apiUtil.js";

    let personArrayName = null; // default is null
    let personRangePoints = []; // points array that will hold the filtered posts

    async function displayrange(personArrayName) {
        try {
            // Fetch the data from the API
            let posts = await fetchPosts();

            console.log("Fetched posts:", posts);

            // Filter the posts by the specified state
            personRangePoints = posts.filter((posts) => posts.type === personArrayName);
            // Filter the posts based on personArrayName (you can modify this as needed)
            personRangePoints = posts.filter(
                (post) =>
                    post.state === personArrayName &&
                    post.confidence_interval &&
                    post.high_ci &&
                    post.low_ci &&
                    post.phase &&
                    post.quartile_range &&
                    post.value,
            );
        } catch (error) {
            console.error("Error displaying posts:", error.message);
            personRangePoints = []; // In case of error, reset the filtered posts
        }
    }

    displayrange();
</script>

<!-- HTML code -->
<div>
    <p>Symptomen van persoon {personArrayName}</p>

    <!-- Input van de gebruiker -->
    <input type="text" bind:value={personArrayName} placeholder="Enter state" />

    <button on:click={() => displayrange(personArrayName)}>Filter person</button
    >

    {#if personRangePoints.length > 0}
        <ul>
            {#each personRangePoints as post}
                <li>
                    {post.confidence_interval}
                    <!-- You can display any other field as needed -->
                </li>
            {/each}
        </ul>
    {:else}
        <p>No posts found for {personArrayName}.</p>
    {/if}
</div>

<!-- styling-->
<link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap"
    rel="stylesheet"
/>

<style>
    div,
    button,
    input {
        font-family: "Montserrat";
        font-optical-sizing: auto;
        font-weight: 200;
        font-style: normal;
        font-size: 20px;
        margin-left: 10px;
    }

    button,
    input {
        border-radius: 5px;
    }
</style> -->
