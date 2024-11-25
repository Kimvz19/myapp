<script>
    // Import Svelte and utility functions
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { fetchPosts } from "../lib/apiUtil.js";

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
    });

    // Function to display data for a specific index from filteredPosts
    async function displayRange(personIndex) {
        if (personIndex >= 0 && personIndex < filteredPosts.length) {
            selectedPost = filteredPosts[personIndex]; // Access directly the post object
            return {
                value: selectedPost.value,
                confidence_interval: selectedPost.confidence_interval,
                lowci: selectedPost.lowci,
                highci: selectedPost.highci,
                quartile_range: selectedPost.quartile_range,
                phase: selectedPost.phase,
            };
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

    let chartContainer; // Verwijzing naar de container voor de grafiek
    let width = 400; // Breedte van de grafiek
    let height = 500; // Hoogte van de grafiek

    // Dataset 1 (Data punten voor Angst, met 'axis' als de assen namen)
    let data1 = [
        { axis: "A", value: "13.3", lowci: "8.6", highci: "19.2" }, // Punt A voor Angst
        { axis: "B", value: "10.1", lowci: "6.5", highci: "14.2" }, // Punt B voor Angst
        { axis: "C", value: "15.0", lowci: "12.3", highci: "18.7" }, // Punt C voor Angst
    ];

    // Dataset 2 (Data punten voor Depressie, met 'axis' als de assen namen)
    let data2 = [
        { axis: "A", value: "12.0", lowci: "9.0", highci: "15.0" }, // Punt A voor Depressie
        { axis: "B", value: "11.5", lowci: "8.0", highci: "15.0" }, // Punt B voor Depressie
        { axis: "C", value: "14.2", lowci: "10.0", highci: "18.0" }, // Punt C voor Depressie
    ];

    let maxValue = 20; // Maximale waarde voor de schaal
    let levels = 5; // Aantal niveau cirkels voor de grafiek

    onMount(() => {
        createRadarChart(chartContainer); // Functie aanroepen wanneer de component is geladen
    });

    // Functie om de radar grafiek te maken
    function createRadarChart(container) {
        let radius = Math.min(width, height) / 2; // Straal van de grafiek
        let angleSlice = (Math.PI * 2) / data1.length; // Hoek per data punt

        // Maak de SVG container voor de grafiek
        let svg = d3
            .select(container) // Selecteer de container
            .attr("width", width) // Stel de breedte in
            .attr("height", height) // Stel de hoogte in
            .html("") // Reset de inhoud van de container
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`); // Center de grafiek

        // SVG-definities voor gradients (kleurverlopen)
        let defs = svg.append("defs");

        // Gradient voor Angst (Turquoise → Grijs)
        let anxietyGradient = defs
            .append("linearGradient")
            .attr("id", "anxietyGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");
        anxietyGradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#40E0D0");
        anxietyGradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#A9A9A9");

        // Gradient voor Depressie (Donkerblauw → Paars)
        let depressionGradient = defs
            .append("linearGradient")
            .attr("id", "depressionGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");
        depressionGradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#00008B");
        depressionGradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#800080");

        // Maak de grid niveaus (cirkels)
        svg.selectAll(".grid-level")
            .data(d3.range(1, levels + 1).reverse()) // Maak cirkels voor elk niveau
            .enter()
            .append("circle")
            .attr("class", "grid-level")
            .attr("r", (d) => (radius / levels) * d) // Straal van de cirkels
            .style("fill", "#CDCDCD")
            .style("stroke", "#999")
            .style("fill-opacity", 0.1);

        // Maak de assen en labels
        let axis = svg
            .selectAll(".axis")
            .data(data1) // Gebruik de data voor de assen
            .enter()
            .append("g")
            .attr("class", "axis");

        // Maak de lijnen voor de assen
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr(
                "x2",
                (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2),
            ) // X-coördinaat van de lijn
            .attr(
                "y2",
                (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2),
            ) // Y-coördinaat van de lijn
            .style("stroke", "#999")
            .style("stroke-width", "2px");

        // Voeg de labels voor de assen toe (Punten A, B, C)
        axis.append("text")
            .attr(
                "x",
                (d, i) =>
                    (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2),
            ) // X-positie van het label
            .attr(
                "y",
                (d, i) =>
                    (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2),
            ) // Y-positie van het label
            .text((d) => d.axis) // Gebruik de 'axis' naam uit de data
            .style("font-size", "12px")
            .attr("text-anchor", "middle"); // Centreer het label op de lijn

        // Functie om een polygon (vorm) te tekenen
        let radarLine = d3
            .lineRadial()
            .radius((d) => (parseFloat(d.value) / maxValue) * radius) // Zet de waarde om naar de straal
            .angle((d, i) => i * angleSlice) // Zet de data om naar hoeken
            .curve(d3.curveCardinalClosed); // Zorg ervoor dat de polygon gesloten is

        // Dataset 1: Angst (Anxiety) polygon tekenen
        svg.append("path")
            .datum(data1) // Gebruik data1 voor Anxiety
            .attr("d", radarLine)
            .style("fill", "url(#anxietyGradient)") // Gebruik de gedefinieerde gradient
            .style("stroke", "#40E0D0")
            .style("stroke-width", "2px")
            .style("fill-opacity", 0.8);

        // Dataset 2: Depressie (Depression) polygon tekenen
        svg.append("path")
            .datum(data2) // Gebruik data2 voor Depression
            .attr("d", radarLine)
            .style("fill", "url(#depressionGradient)") // Gebruik de gedefinieerde gradient
            .style("stroke", "#800080")
            .style("stroke-width", "2px")
            .style("fill-opacity", 0.8);

        // Nu, om de confidence interval lijnen te tekenen (lowci, highci):
        function drawConfidenceInterval(data, color) {
            let radarLineCI = d3
                .lineRadial()
                .radius((d) => (parseFloat(d.lowci) / maxValue) * radius) // Low CI lijn
                .angle((d, i) => i * angleSlice)
                .curve(d3.curveCardinalClosed);
            svg.append("path")
                .datum(data) // Gebruik data voor Anxiety of Depression
                .attr("d", radarLineCI)
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-dasharray", "3,3")
                .style("stroke-width", "2px");

            let radarLineHighCI = d3
                .lineRadial()
                .radius((d) => (parseFloat(d.highci) / maxValue) * radius) // High CI lijn
                .angle((d, i) => i * angleSlice)
                .curve(d3.curveCardinalClosed);
            svg.append("path")
                .datum(data) // Gebruik data voor Anxiety of Depression
                .attr("d", radarLineHighCI)
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-dasharray", "3,3")
                .style("stroke-width", "2px");
        }

        // Teken confidence intervals
        drawConfidenceInterval(data1, "#40E0D0"); // Anxiety
        drawConfidenceInterval(data2, "#800080"); // Depression
    }
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

<!-- radar chart-->
<svg bind:this={chartContainer}></svg>






<!------------->
<!-- Styling -->
<!------------->
<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
/>

<style>

    div{
        display: flex;
        justify-content: center ;
    }
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

    svg {
        display: block;
        margin: auto;
    }

</style>
