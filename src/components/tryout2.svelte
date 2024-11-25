<script>
    // Import Svelte, D3 en utility functies
    import { onMount } from "svelte";
    import { fetchPosts } from "../lib/apiUtil.js";
    import * as d3 from "d3";

    // Variabelen voor de API en post filtering
    let result1 = [];
    let result2 = [];
    let actualTimePeriod = []; // De meest actuele tijdsperiode
    let filteredPosts = []; // Gefilterde posts op basis van staat en tijdsperiode
    let stateFilter = "hawaii"; // Standaard staat, in kleine letters voor case-insensitive vergelijking
    let dataFound = false; // Trackt of data gevonden is
    let index1 = null; // Index voor de eerste vergelijking
    let index2 = null; // Index voor de tweede vergelijking
    let selectedPost = {}; // Huidige geselecteerde post object

    // Variabelen voor de radar chart
    let chartContainer; // Verwijzing naar de container voor de grafiek
    let width = 400; // Breedte van de grafiek
    let height = 500; // Hoogte van de grafiek

    // Dataset 1 (Angst)
    let data1 = [
        { axis: "A", value: "13.3", lowci: "8.6", highci: "19.2" },
        { axis: "B", value: "10.1", lowci: "6.5", highci: "14.2" },
        { axis: "C", value: "15.0", lowci: "12.3", highci: "18.7" },
    ];

    // Dataset 2 (Depressie)
    let data2 = [
        { axis: "A", value: "12.0", lowci: "9.0", highci: "15.0" },
        { axis: "B", value: "11.5", lowci: "8.0", highci: "15.0" },
        { axis: "C", value: "14.2", lowci: "10.0", highci: "18.0" },
    ];

    let maxValue = 20; // Maximale waarde voor de schaal
    let levels = 5; // Aantal niveau cirkels voor de grafiek

    // Functie om de meest actuele tijdsperiode te verkrijgen en posts te filteren
    async function displayTime() {
        try {
            // Haal data op van de API
            let data = await fetchPosts();

            // Vind de meest recente tijdsperiode
            let maxTimePeriod = Math.max(
                ...data.map((item) => Number(item.time_period)),
            );

            // Filter data op de meest recente tijdsperiode
            actualTimePeriod = data.filter(
                (item) => Number(item.time_period) === maxTimePeriod,
            );

            // Filter de posts op basis van de geselecteerde staat
            filteredPosts = actualTimePeriod.filter(
                (post) =>
                    post.state.toLowerCase() === stateFilter.toLowerCase(),
            );

            // Zet de dataFound status
            dataFound = filteredPosts.length > 0;
        } catch (error) {
            console.error("Error fetching data:", error.message);
            filteredPosts = []; // Reset gefilterde posts bij fout
            dataFound = false; // Geen data gevonden bij fout
        }
    }

    // Functie om de grafiek te maken
    function createRadarChart(container) {
        let radius = Math.min(width, height) / 2;
        let angleSlice = (Math.PI * 2) / data1.length;

        // Maak SVG container voor de grafiek
        let svg = d3
            .select(container)
            .attr("width", width)
            .attr("height", height)
            .html("") // Reset de container inhoud
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`); // Centreer de grafiek

        // Definities voor gradients (kleurverlopen)
        let defs = svg.append("defs");

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

        // Maak de grid niveaus
        svg.selectAll(".grid-level")
            .data(d3.range(1, levels + 1).reverse())
            .enter()
            .append("circle")
            .attr("class", "grid-level")
            .attr("r", (d) => (radius / levels) * d)
            .style("fill", "#CDCDCD")
            .style("stroke", "#999")
            .style("fill-opacity", 0.1);

        // Maak de assen en labels
        let axis = svg
            .selectAll(".axis")
            .data(data1)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr(
                "x2",
                (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2)
            )
            .attr(
                "y2",
                (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2)
            )
            .style("stroke", "#999")
            .style("stroke-width", "2px");

        axis.append("text")
            .attr(
                "x",
                (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2)
            )
            .attr(
                "y",
                (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2)
            )
            .text((d) => d.axis)
            .style("font-size", "12px")
            .attr("text-anchor", "middle");

        // Functie voor het tekenen van een polygon
        let radarLine = d3
            .lineRadial()
            .radius((d) => (parseFloat(d.value) / maxValue) * radius)
            .angle((d, i) => i * angleSlice)
            .curve(d3.curveCardinalClosed);

        // Angst polygon tekenen
        svg.append("path")
            .datum(data1)
            .attr("d", radarLine)
            .style("fill", "url(#anxietyGradient)")
            .style("stroke", "#40E0D0")
            .style("stroke-width", "2px")
            .style("fill-opacity", 0.8);

        // Depressie polygon tekenen
        svg.append("path")
            .datum(data2)
            .attr("d", radarLine)
            .style("fill", "url(#depressionGradient)")
            .style("stroke", "#800080")
            .style("stroke-width", "2px")
            .style("fill-opacity", 0.8);

        // Teken confidence interval lijnen
        function drawConfidenceInterval(data, color) {
            let radarLineCI = d3
                .lineRadial()
                .radius((d) => (parseFloat(d.lowci) / maxValue) * radius)
                .angle((d, i) => i * angleSlice)
                .curve(d3.curveCardinalClosed);
            svg.append("path")
                .datum(data)
                .attr("d", radarLineCI)
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-dasharray", "3,3")
                .style("stroke-width", "2px");

            let radarLineHighCI = d3
                .lineRadial()
                .radius((d) => (parseFloat(d.highci) / maxValue) * radius)
                .angle((d, i) => i * angleSlice)
                .curve(d3.curveCardinalClosed);
            svg.append("path")
                .datum(data)
                .attr("d", radarLineHighCI)
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-dasharray", "3,3")
                .style("stroke-width", "2px");
        }

        // Confidence intervals voor angst en depressie
        drawConfidenceInterval(data1, "#40E0D0");
        drawConfidenceInterval(data2, "#800080");
    }

    // Zorg ervoor dat de grafiek wordt getekend wanneer de component wordt geladen
    onMount(() => {
        createRadarChart(chartContainer);
        displayTime(); // Laad de posts bij de mount
    });

    // Functie om de post te selecteren
    function selectPost(post) {
        selectedPost = post;
        index1 = post.index1;
        index2 = post.index2;
    }
</script>

<!-- HTML voor de grafiek en post-informatie -->
<div bind:this={chartContainer} class="chart-container"></div>
{#if dataFound}
    <ul>
        {#each filteredPosts as post}
            <li on:click={() => selectPost(post)}>
                {post.title}
            </li>
        {/each}
    </ul>
{/if}
{#if selectedPost}
    <div>
        <h3>{selectedPost.title}</h3>
        <p>{selectedPost.body}</p>
    </div>
{/if}

<style>
    .chart-container {
        margin: auto;
        max-width: 90%;
        height: 500px;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        cursor: pointer;
        margin-bottom: 10px;
    }

    li:hover {
        background-color: #f0f0f0;
    }
</style>
