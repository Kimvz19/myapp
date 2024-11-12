<script>

///////////////////////////////
//Code voor Radar chart uit D3
///////////////////////////////

//importeren van D3
    import { onMount } from 'svelte';
    import * as d3 from 'd3';



    // Voorbeelddata (elke categorie met een waarde)

    // Punten van de Radar chart
    // Later anders benoemen voor de data

    //Wat wil ik bereiken : dat je met de filters kunt kiezen wat er op deze punten van de data komt te staan

    let data = [
        { axis: "Speed", value: 0.7 },
        { axis: "Strength", value: 0.8 },
        { axis: "Agility", value: 0.6 },
        { axis: "Endurance", value: 0.9 },
        { axis: "Flexibility", value: 0.5 },
    ];


    let width = 1500;
    let height = 1000;
    let maxValue = 1;



    // Schalen en instellingen voor de grafiek
    let radius = Math.min(width / 2, height / 2);
    let angleSlice = (Math.PI * 2) / data.length;
    let levels = 5;  // Aantal concentrische cirkels

    // Container referentie voor de grafiek
    let chartContainer;

    // Functie voor het genereren van de radar chart
    const drawChart = (container) => {
        // Bereken het schaalbereik en de hoekpunten voor de data
        const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

        const svg = d3.select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Cirkelvormige grid lagen toevoegen
        for (let level = 0; level < levels; level++) {
            const r = radius / levels * (level + 1);
            svg.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", r)
                .style("fill", "none")
                .style("stroke", "#ddd")
                .style("stroke-width", 0.5);
        }

        // Aslijnen en labels voor elke categorie
        data.forEach((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const lineCoord = { x: rScale(maxValue) * Math.cos(angle), y: rScale(maxValue) * Math.sin(angle) };
            const labelCoord = { x: (rScale(maxValue) + 20) * Math.cos(angle), y: (rScale(maxValue) + 20) * Math.sin(angle) };

            // Aslijnen tekenen
            svg.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", lineCoord.x)
                .attr("y2", lineCoord.y)
                .style("stroke", "#888")
                .style("stroke-width", 0.5);

            // Label voor elke as
            svg.append("text")
                .attr("x", labelCoord.x)
                .attr("y", labelCoord.y)
                .attr("dy", "0.5em")
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .text(d.axis);
        });

        // Data naar polaire coördinaten converteren
        const line = d3.lineRadial()
            .radius((d) => rScale(d.value))
            .angle((d, i) => i * angleSlice);

        // Pad tekenen
        svg.append("path")
            .datum(data)
            .attr("d", line)
            .style("fill", "rgba(0, 128, 255, 0.3)")
            .style("stroke", "#007acc")
            .style("stroke-width", 2);
    };

    // Teken de grafiek wanneer het component wordt gemonteerd
    onMount(() => {
        drawChart(chartContainer);
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


  