<script>
    // Import the necessary functions and components
    import { onMount } from "svelte";
    import { fetchPosts } from "../lib/apiUtil.js";

    // Variabelen
    let actualTimePeriod = []; // De meest actuele tijdsperiode
    let filteredPosts = []; // Geselecteerde posts op basis van state en actualTimePeriod
    let stateFilter = "hawaii"; // Default state, in kleine letters om hoofdlettergevoeligheid te voorkomen
    let dataFound = false; // Variabele om bij te houden of gegevens zijn gevonden

    // Functie voor het ophalen van de meest actuele tijdsperiode
    async function displayTime() {
        try {
            // Haal de data op uit de API
            let data = await fetchPosts();

            // Vind de meest recente time_period
            let maxTimePeriod = Math.max(
                ...data.map((item) => Number(item.time_period)),
            );

            // Filter de data op de meest actuele time_period
            actualTimePeriod = data.filter(
                (item) => Number(item.time_period) === maxTimePeriod,
            );

            // Filter de posts op basis van de meest actuele time_period en de opgegeven state (zonder hoofdlettergevoeligheid)
            filteredPosts = actualTimePeriod.filter(
                (post) =>
                    post.state.toLowerCase() === stateFilter.toLowerCase(), // Vergelijk alles in kleine letters
            );

            // Update de dataFound status
            dataFound = filteredPosts.length > 0;
        } catch (error) {
            console.error("Error bij het ophalen van data:", error.message);
            filteredPosts = []; // Reset de filteredPosts bij een fout
            dataFound = false; // Geen gegevens gevonden bij fout
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
    <input type="text" bind:value={stateFilter} placeholder="Enter state" />

    <button on:click={() => displayTime()}>Filter Posts</button>

    <!-- De ronde knop die aangeeft of er gegevens gevonden zijn -->
    <button
        class="status-button"
        style:background-color={dataFound ? "green" : "red"}
    >
        <!-- Gebruik externe SVG bestanden -->
        {#if dataFound}
            <!-- Groen vinkje als gegevens zijn gevonden -->
            <svg
                width="10"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6 12C6.78793 12 7.56815 11.8448 8.2961 11.5433C9.02405 11.2417 9.68549 10.7998 10.2426 10.2426C10.7998 9.68549 11.2417 9.02405 11.5433 8.2961C11.8448 7.56815 12 6.78793 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 -1.17411e-08 6 0C4.4087 2.37122e-08 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.88258 11.3679 4.4087 12 6 12ZM5.84533 8.42667L9.17867 4.42667L8.15467 3.57333L5.288 7.01267L3.80467 5.52867L2.862 6.47133L4.862 8.47133L5.378 8.98733L5.84533 8.42667Z"
                    fill="#14AE5C"
                />
            </svg>
        {:else}
            <!-- Rood kruisje als geen gegevens zijn gevonden -->
    
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.66667 0C10.3533 0 13.3333 2.98 13.3333 6.66667C13.3333 10.3533 10.3533 13.3333 6.66667 13.3333C2.98 13.3333 0 10.3533 0 6.66667C0 2.98 2.98 0 6.66667 0ZM9.06 3.33333L6.66667 5.72667L4.27333 3.33333L3.33333 4.27333L5.72667 6.66667L3.33333 9.06L4.27333 10L6.66667 7.60667L9.06 10L10 9.06L7.60667 6.66667L10 4.27333L9.06 3.33333Z" fill="#F24822"/>
                </svg>
        {/if}
    </button>

    {#if filteredPosts.length > 0}
        <ul>
            {#each filteredPosts as post}
                <li>
                    {post.indicator} - {post.state} - {post.confidence_interval}
                </li>
            {/each}
        </ul>
    {:else}
        <p>No posts found for {stateFilter}.</p>
    {/if}
</div>

<!-- Styling -->
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

    .status-button {
        width: 15px; /* Vergroot de knop */
        height: 16px; /* Vergroot de knop */
        border-radius: 50%; /* Ronde knop */
        margin-left: 15px; /* Iets meer ruimte */
        border: none;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease; /* Zorgt voor een vloeiende overgang bij kleurverandering */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Schaduw voor extra diepte */
    }

    .status-button:hover {
        transform: scale(1.1); /* Knop wordt groter bij hover */
    }

    .status-icon {
        width: 24px; /* Maak het pictogram iets groter */
        height: 24px;
    }

    .status-button:active {
        transform: scale(0.95); /* Knop wordt iets kleiner wanneer ingedrukt */
    }
</style>
