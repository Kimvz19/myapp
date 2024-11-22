<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

    import { getPersonDetails } from "./path/to/your/script";

    // Gebruik de functie
    let personData = getPersonDetails(1);
    console.log(personData);

    // Voorbeelddata met intervallen en numerieke waarden
    let apiData = {
        confidence: [0.6, 0.8], // Interval
        highci: 1.5, // Nummer
        lowci: 0.5, // Nummer
        phase: 2, // Nummer
        quartile: [0.2, 0.7], // Interval
        value: [0.4, 0.9], // Interval
    };

    // Functie om waarden te schalen tussen 0 en 1
    const normalize = (value, min, max) => (value - min) / (max - min);

    // Minimum- en maximumwaarden instellen voor normalisatie
    const rangeMap = {
        confidence: { min: 0, max: 1 },
        highci: { min: 0, max: 2 },
        lowci: { min: 0, max: 1 },
        phase: { min: 0, max: 2 },
        quartile: { min: 0, max: 1 },
        value: { min: 0, max: 1 },
    };

    // Data splitsen in minimum- en maximumwaarden
    let dataMin = [];
    let dataMax = [];

    for (let [key, value] of Object.entries(apiData)) {
        if (Array.isArray(value)) {
            dataMin.push({
                axis: key,
                value: normalize(
                    value[0],
                    rangeMap[key].min,
                    rangeMap[key].max,
                ),
            });
            dataMax.push({
                axis: key,
                value: normalize(
                    value[1],
                    rangeMap[key].min,
                    rangeMap[key].max,
                ),
            });
        } else {
            let normalized = normalize(
                value,
                rangeMap[key].min,
                rangeMap[key].max,
            );
            dataMin.push({ axis: key, value: normalized });
            dataMax.push({ axis: key, value: normalized });
        }
    }

    let width = 1450;
    let height = 950;
    let maxValue = 1;

    let radius = Math.min(width / 2, height / 2.2);
    let angleSlice = (Math.PI * 2) / dataMin.length;
    let levels = 15;

    let chartContainer;

    // Functie voor het genereren van de radar chart
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

        // Cirkelvormige grid lagen toevoegen
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

        // Aslijnen en labels toevoegen
        dataMin.forEach((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const lineCoord = {
                x: rScale(maxValue) * Math.cos(angle),
                y: rScale(maxValue) * Math.sin(angle),
            };
            const labelCoord = {
                x: (rScale(maxValue) + 20) * Math.cos(angle),
                y: (rScale(maxValue) + 20) * Math.sin(angle),
            };

            // Aslijnen
            svg.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", lineCoord.x)
                .attr("y2", lineCoord.y)
                .style("stroke", "#888")
                .style("stroke-width", 0.5);

            // Labels
            svg.append("text")
                .attr("x", labelCoord.x)
                .attr("y", labelCoord.y)
                .attr("dy", "0.5em")
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .text(d.axis);
        });

        // Functie om een pad te tekenen
        const drawPath = (data, fill, stroke) => {
            const line = d3
                .lineRadial()
                .radius((d) => rScale(d.value))
                .angle((d, i) => i * angleSlice);

            svg.append("path")
                .datum(data)
                .attr("d", line)
                .style("fill", fill)
                .style("stroke", stroke)
                .style("stroke-width", 2);
        };

        // Pad voor de minimumwaarden
        drawPath(dataMin, "rgba(0, 128, 255, 0.3)", "#007acc");

        // Pad voor de maximumwaarden
        drawPath(dataMax, "rgba(255, 0, 128, 0.3)", "#ff0080");
    };

    // Teken de grafiek wanneer het component wordt gemonteerd
    onMount(() => {
        drawChart(chartContainer);
    });
</script>

<!-- Container voor de grafiek -->
<div bind:this={chartContainer}></div>

<!-- // //importeren van D3
//     import { onMount } from 'svelte';
//     import * as d3 from 'd3';

//     let data = [
//         { axis: "confidence", value: 0.7 },
//         { axis: "highci", value: 0.8 },
//         { axis: "lowci", value: 0.6 },
//         { axis: "phase", value: 0.9 },
//         { axis: "quartile", value: 0.5 },
//     ];

//     let width = 1450;
//     let height = 950;
//     let maxValue = 1;

//     // Schalen en instellingen voor de grafiek
//     let radius = Math.min(width / 2, height / 2.2);
//     let angleSlice = (Math.PI * 2) / data.length; //bepaadld de hoek tussen de punten
//     let levels = 15;  // Aantal concentrische cirkels


//     let chartContainer;

//     // Functie voor het genereren van de radar chart
//     const drawChart = (container) => { -->
<!-- //         // Bereken het schaalbereik en de hoekpunten voor de data
//         const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

//         const svg = d3.select(container)
//             .append("svg")
//             .attr("width", width)
//             .attr("height", height)
//             .append("g")
//             .attr("transform", `translate(${width / 2}, ${height / 2})`);

//         // Cirkelvormige grid lagen toevoegen
//         for (let level = 0; level < levels; level++) { -->
<!-- //             const r = radius / levels * (level + 1);
//             svg.append("circle")
//                 .attr("cx", 0)
//                 .attr("cy", 0)
//                 .attr("r", r)
//                 .style("fill", "none")
//                 .style("stroke", "#ddd")
//                 .style("stroke-width", 0.5);
//         }

//         // Aslijnen en labels voor elke categorie
//         data.forEach((d, i) => { -->
<!-- //             const angle = angleSlice * i - Math.PI / 2;
//             const lineCoord = { x: rScale(maxValue) * Math.cos(angle), y: rScale(maxValue) * Math.sin(angle) };
//             const labelCoord = { x: (rScale(maxValue) + 20) * Math.cos(angle), y: (rScale(maxValue) + 20) * Math.sin(angle) };

//             // Aslijnen tekenen
//             svg.append("line")
//                 .attr("x1", 0)
//                 .attr("y1", 0)
//                 .attr("x2", lineCoord.x)
//                 .attr("y2", lineCoord.y)
//                 .style("stroke", "#888")
//                 .style("stroke-width", 0.5);

//             // Label voor elke as
//             svg.append("text")
//                 .attr("x", labelCoord.x)
//                 .attr("y", labelCoord.y)
//                 .attr("dy", "0.5em")
//                 .attr("text-anchor", "middle")
//                 .style("font-size", "10px")
//                 .text(d.axis);
//         }); -->
<!-- 
//         // Data naar polaire coördinaten converteren
//         const line = d3.lineRadial()
//             .radius((d) => rScale(d.value))
//             .angle((d, i) => i * angleSlice);

//         // Pad tekenen
//         svg.append("path")
//             .datum(data)
//             .attr("d", line)
//             .style("fill", "rgba(0, 128, 255, 0.3)")
//             .style("stroke", "#007acc")
//             .style("stroke-width", 2);
//     };

//     // Teken de grafiek wanneer het component wordt gemonteerd
//     onMount(() => { -->
<!-- //         drawChart(chartContainer);
//     });
// </script>

// <!-- Container voor de grafiek -->
<!-- // <div bind:this={chartContainer}></div>

// <style>
//     div {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//     }
// </style> -->
-->

<style>
    div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
