<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import {result1, result2} from "../components/tryout.svelte";


    async function importResults() {
    try {
      //aanroepen van de data uit de API
      let dataIndex1 = await result1;
      let dataIndex2 = await result2;

    console.log("Data Index 1:", dataIndex1);
    console.log("Data Index 2:", dataIndex2);

    } catch (error) {
      // Melding voor error
      console.error("Error bij het ophalen van data:", error.message);
    }

  }


    // Voorbeeld data voor de grafiek
    let apiData = {
        confidence: [0.6, 0.8], // Interval
        highci: 1.5, // Nummer
        lowci: 0.5, // Nummer
        phase: 2, // Nummer
        quartile: [0.2, 0.7], // Interval
        value: [0.4, 0.9], // Interval
    };

    // Afmetingen en instellingen voor de grafiek
    let width = 1450;
    let height = 950;
    let maxValue = 1;
    let radius = Math.min(width / 2, height / 2.2);
    let angleSlice = (Math.PI * 2) / apiData.confidence.length; // Aantal assen (één per dataset)
    let levels = 15; // Aantal concentrische lagen in de grafiek

    let chartContainer;

    // Functie voor het genereren van de radar grafiek
    const drawChart = (container) => {
        const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);
        
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
        apiData.confidence.forEach((d, i) => {
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
        drawPath(apiData.confidence, "rgba(0, 128, 255, 0.3)", "#007acc");
    };

    // De grafiek tekenen zodra het component is gemonteerd
    onMount(() => {
        drawChart(chartContainer); // Activeert de grafiek
    });
</script>

<!-- Container voor de grafiek -->
<div bind:this={chartContainer}></div>

<style>
    div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>



