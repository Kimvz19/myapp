<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
 
    // Variabelen voor de afmetingen van de SVG
    let width = 200;
    let height = 200;
 
    onMount(() => {
        // Selecteer het SVG-element
        const svg = d3.select("#chart")
            .attr("width", width)
            .attr("height", height);
 
        // Voeg een cirkel toe aan de SVG
        svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", 50)
            .style("fill", "pink");
    });
</script>
 
<svg id="chart"></svg>