<script>
    // Import Svelte and utility functions
    import { onMount } from "svelte";
    import { fetchPosts } from "../lib/apiUtil.js";
    import * as d3 from "d3";

    let result1 = [];
    let result2 = [];

    // Variables
    let actualTimePeriod = []; // The most current time period
    let filteredPosts = []; // Filtered posts based on state and time period
    let stateFilter = "hawaii"; // Default state, in lowercase to avoid case sensitivity
    let dataFound = false; // To track if data is found
    let index1 = null; // Index for the first comparison
    let index2 = null; // Index for the second comparison

    let selectedPost = {}; // Changed from array to object for single post


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
        displayTime().then(() => {
            // Log after data is fetched and available
            console.log(filteredPosts); // Log filtered posts once data is available
        });
        drawChart(chartContainer); // Activeert de grafiek
    });

    // Function to display data for a specific index from filteredPosts
    async function displayRange(personIndex) {
        if (personIndex >= 0 && personIndex < filteredPosts.length) {
            selectedPost = filteredPosts[personIndex]; // Access directly the post object
            return [
                selectedPost.value,
                selectedPost.confidence_interval,
                selectedPost.lowci,
                selectedPost.highci,
                selectedPost.quartile_range,
                selectedPost.phase,
            ];
        } else {
            return "<p>Er is een foutje, vul een ander nummer in!</p>";
        }
    }

    // Function to compare two indexes in filteredPosts
    async function compareIndexes() {
        let outputDiv = document.querySelector(".resultOutput");

        // Ensure that the indexes are valid numbers and within range
        let index1Valid = index1 >= 0 && index1 < filteredPosts.length;
        let index2Valid = index2 >= 0 && index2 < filteredPosts.length;

        if (index1Valid && index2Valid) {
            result1 = await displayRange(index1);
            result2 = await displayRange(index2);
            console.log(result1, result2);

            // Display the comparison results
            outputDiv.innerHTML = `
                <h2>Comparison of Index ${index1} and Index ${index2}</h2>
                <div><h3>Index ${index1}</h3>${result1}</div>
                <div><h3>Index ${index2}</h3>${result2}</div>
            `;
        } else {
            outputDiv.innerHTML =
                "<p>Er is een fout, vul een ander nummer in!</p>";
        }
    }

    // Function to reset the form and variables to initial state
    function resetForm() {
        stateFilter = "hawaii"; // Reset state filter to the default state
        index1 = null; // Reset the first index
        index2 = null; // Reset the second index
        filteredPosts = []; // Clear filtered posts
        actualTimePeriod = []; // Clear actual time period data
        dataFound = false; // Reset the dataFound status
    }

//////////////////
// Radar chart //
//////////////////

    //    // Voorbeeld data voor de grafiek
    //    let apiData = {
    //     confidence: [0.6, 0.8], // Interval
    //     highci: 1.5, // Nummer
    //     lowci: 0.5, // Nummer
    //     phase: 2, // Nummer
    //     quartile: [0.2, 0.7], // Interval
    //     value: [0.4, 0.9], // Interval
    // };

    // Afmetingen en instellingen voor de grafiek
    let width = 1450;
    let height = 950;
    let maxValue = 1;
    let radius = Math.min(width / 2, height / 2.2);
    let angleSlice = (Math.PI * 2) / 4; // Aantal assen (één per dataset)
    let levels = 15; // Aantal concentrische lagen in de grafiek

    let chartContainer;

    // Functie voor het genereren van de radar grafiek
    const drawChart = (container) => {
        const rScale = d3
            .scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

        const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Voeg de concentrische cirkels toe
        for (let level = 0; level < levels; level++) {
            const r = (radius / levels) * (level + 1);
            svg.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", r)
                .style("fill", "none")
                .style("stroke", "#ddd")
                .style("stroke-width", 0.5);
        }

        // Voeg de assen en labels toe
        result1.confidence.forEach((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const lineCoord = {
                x: rScale(maxValue) * Math.cos(angle),
                y: rScale(maxValue) * Math.sin(angle),
            };
            const labelCoord = {
                x: (rScale(maxValue) + 20) * Math.cos(angle),
                y: (rScale(maxValue) + 20) * Math.sin(angle),
            };

            // Tekenen van de assen
            svg.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", lineCoord.x)
                .attr("y2", lineCoord.y)
                .style("stroke", "#888")
                .style("stroke-width", 0.5);

            // Toevoegen van labels voor elke as
            svg.append("text")
                .attr("x", labelCoord.x)
                .attr("y", labelCoord.y)
                .attr("dy", "0.5em")
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .text(d); // 'd' is de naam van de as
        });

        // Functie voor het tekenen van het pad van de grafiek
        const drawPath = (data, fill, stroke) => {
            const line = d3
                .lineRadial()
                .radius((d) => rScale(d))
                .angle((d, i) => i * angleSlice);

            svg.append("path")
                .datum(data)
                .attr("d", line)
                .style("fill", fill)
                .style("stroke", stroke)
                .style("stroke-width", 2);
        };

        // Pad voor de data tekenen (bijvoorbeeld voor confidence)
        drawPath(result1.confidence, "rgba(0, 128, 255, 0.3)", "#007acc");
    };

    // De grafiek tekenen zodra het component is gemonteerd

</script>

<!-- HTML Code -->
<div>
    <p>Data in {stateFilter}</p>

    <!-- User input for the state -->
    <input
        class="input-field"
        type="text"
        bind:value={stateFilter}
        placeholder="Enter state"
    />

    <!-- Filter posts button -->
    <button on:click={displayTime}>Filter Posts</button>

    <!-- Status button showing if data is found -->
    <button
        class="status-button"
        style="background-color: {dataFound ? 'green' : 'red'}"
    >
        {#if dataFound}
            <!-- Green check mark if data is found -->
            <svg width="10" height="12" viewBox="0 0 12 12" fill="none">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6 12C6.78793 12 7.56815 11.8448 8.2961 11.5433C9.02405 11.2417 9.68549 10.7998 10.2426 10.2426C10.7998 9.68549 11.2417 9.02405 11.5433 8.2961C11.8448 7.56815 12 6.78793 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 -1.17411e-08 6 0C4.4087 2.37122e-08 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.88258 11.3679 4.4087 12 6 12ZM5.84533 8.42667L9.17867 4.42667L8.15467 3.57333L5.288 7.01267L3.80467 5.52867L2.862 6.47133L4.862 8.47133L5.378 8.98733L5.84533 8.42667Z"
                    fill="#14AE5C"
                />
            </svg>
        {:else}
            <!-- Red cross if no data is found -->
            <svg width="10" height="12" viewBox="0 0 12 12" fill="none">
                <path
                    d="M6.66667 0C10.3533 0 13.3333 2.98 13.3333 6.66667C13.3333 10.3533 10.3533 13.3333 6.66667 13.3333C2.98 13.3333 0 10.3533 0 6.66667C0 2.98 2.98 0 6.66667 0ZM9.06 3.33333L6.66667 5.72667L4.27333 3.33333L3.33333 4.27333L5.72667 6.66667L3.33333 9.06L4.27333 10L6.66667 7.60667L9.06 10L10 9.06L7.60667 6.66667L10 4.27333L9.06 3.33333Z"
                    fill="#F00"
                />
            </svg>
        {/if}
    </button>

    <!-- Input fields for comparison indexes -->
    <input
        class="input-field"
        type="number"
        bind:value={index1}
        placeholder="Enter person"
        min="0"
    />

    <input
        class="input-field"
        type="number"
        bind:value={index2}
        placeholder="Enter person"
        min="0"
    />

    <button on:click={compareIndexes}>Vergelijk</button>

    <!-- Reset Button -->
    <button on:click={resetForm}>Reset</button>
    <!-- Reset button added -->

    <!-- Result output -->
    <div class="resultOutput"></div>
</div>

<div class="chart" bind:this={chartContainer}></div>

<!-- Styling -->
<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
/>

<style>
    button,
    p,
    .input-field {
        font-family: "Montserrat";
        font-optical-sizing: auto;
        font-weight: 200;
        font-style: normal;
        font-size: 20px;
        margin-left: 10px;
    }

    .input-field {
        margin: 10px;
        padding: 8px;
        font-size: 14px;
    }

    .status-button {
        width: 120px;
        height: 40px;
        font-size: 14px;
        border-radius: 5px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .resultOutput {
        margin-top: 20px;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 8px;
    }


    .chart {
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
