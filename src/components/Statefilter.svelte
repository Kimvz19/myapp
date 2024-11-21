<!-- Er zitten 2 filters hierin-->


<script>
    // Import the necessary functions and components
    import { onMount } from "svelte";
    import { fetchPosts } from "../lib/apiUtil.js";

    // Variabelen
    let actualTimePeriod = []; // De meest actuele tijdsperiode
    let filteredPosts = []; // Geselecteerde posts op basis van state en actualTimePeriod
    let stateFilter = "Hawaii"; // Default state

    // Functie voor het ophalen van de meest actuele tijdsperiode
    async function displayTime() {
        try {
            // Haal de data op uit de API
            let data = await fetchPosts();

            // Vind de meest recente time_period
            let maxTimePeriod = Math.max(...data.map((item) => Number(item.time_period)));

            // Filter de data op de meest actuele time_period
            actualTimePeriod = data.filter((item) => Number(item.time_period) === maxTimePeriod);

              // Filter de posts op basis van de meest actuele time_period en de opgegeven state (zonder hoofdlettergevoeligheid)
              filteredPosts = actualTimePeriod.filter((post) => 
                post.state.toLowerCase() === stateFilter.toLowerCase() // Vergelijk alles in kleine letters
            );

            
        } catch (error) {
            console.error("Error bij het ophalen van data:", error.message);
            filteredPosts = []; // Reset de filteredPosts bij een fout
        }
    }

    // Roep de displayTime functie aan bij het laden van de component
    onMount(() => {
        displayTime();
    });

    // Automatisch opnieuw loggen als de waarde verandert
    $: console.log(filteredPosts);
</script>

<!-- HTML Code -->
<div>
    <p>Gegevens in {stateFilter}</p>

    <!-- Gebruikersinput voor de state -->
    <input
        type="text"
        bind:value={stateFilter}
        placeholder="Enter state"
    />

    <button on:click={() => displayTime()}>Filter Posts</button>

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

<!-- Styling -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap" rel="stylesheet">

<style>
    div, button, input {
        font-family: "Montserrat";
        font-optical-sizing: auto;
        font-weight: 200;
        font-style: normal;
        font-size: 20px;
        margin-left: 10px;
    }

    button, input {
        border-radius: 5px;
    }
</style>





<!-- styling-->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap" rel="stylesheet">
