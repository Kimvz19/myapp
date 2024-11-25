<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

    let chartContainer; // Verwijzing naar de SVG-container
    let width = 400;
    let height = 400;

    // Dataset 1 (Roze)
    let data1 = [
        {
            axis: "A",
            value: "13.3",
            lowci: "8.6",
            highci: "19.2",
            confidence_interval: "8.6 - 19.2",
        },
        {
            axis: "B",
            value: "10.1",
            lowci: "6.5",
            highci: "14.2",
            confidence_interval: "6.5 - 14.2",
        },
        {
            axis: "C",
            value: "15.0",
            lowci: "12.3",
            highci: "18.7",
            confidence_interval: "12.3 - 18.7",
        },
    ];

    // Dataset 2 (Groen)
    let data2 = [
        {
            axis: "A",
            value: "12.0",
            lowci: "9.0",
            highci: "15.0",
            confidence_interval: "9.0 - 15.0",
        },
        {
            axis: "B",
            value: "11.5",
            lowci: "8.0",
            highci: "15.0",
            confidence_interval: "8.0 - 15.0",
        },
        {
            axis: "C",
            value: "14.2",
            lowci: "10.0",
            highci: "18.0",
            confidence_interval: "10.0 - 18.0",
        },
    ];

    let maxValue = 20; // Maximale waarde (afhankelijk van je dataset)
    let levels = 5; // Aantal niveaus in de grid

    onMount(() => {
        createRadarChart(chartContainer);
    });

    function createRadarChart(container) {
        const radius = Math.min(width, height) / 2;
        const angleSlice = (Math.PI * 2) / data1.length;

        const svg = d3
            .select(container)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Grid niveaus
        svg.selectAll(".grid-level")
            .data(d3.range(1, levels + 1).reverse())
            .enter()
            .append("circle")
            .attr("class", "grid-level")
            .attr("r", (d) => (radius / levels) * d)
            .style("fill", "#CDCDCD")
            .style("stroke", "#999")
            .style("fill-opacity", 0.1);

        // Assen en labels
        const axis = svg
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
                (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2),
            )
            .attr(
                "y2",
                (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2),
            )
            .style("stroke", "#999")
            .style("stroke-width", "2px");

        axis.append("text")
            .attr(
                "x",
                (d, i) =>
                    (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2),
            )
            .attr(
                "y",
                (d, i) =>
                    (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2),
            )
            .text((d) => d.axis)
            .style("font-size", "12px")
            .attr("text-anchor", "middle");

        // Functie om een polygon te tekenen
        const radarLine = d3
            .lineRadial()
            .radius((d) => (parseFloat(d.value) / maxValue) * radius)
            .angle((d, i) => i * angleSlice)
            .curve(d3.curveLinearClosed);

        // Dataset 1: Confidence interval (Roze schaduw)
        svg.append("path")
            .datum(data1)
            .attr(
                "d",
                d3
                    .lineRadial()
                    .radius((d) => (parseFloat(d.highci) / maxValue) * radius)
                    .angle((d, i) => i * angleSlice)
                    .curve(d3.curveLinearClosed),
            )
            .style("fill", "rgba(255, 20, 147, 0.2)") // Roze transparante schaduw
            .style("stroke", "none");

        svg.append("path")
            .datum(data1)
            .attr(
                "d",
                d3
                    .lineRadial()
                    .radius((d) => (parseFloat(d.lowci) / maxValue) * radius)
                    .angle((d, i) => i * angleSlice)
                    .curve(d3.curveLinearClosed),
            )
            .style("fill", "rgba(255, 20, 147, 0.2)")
            .style("stroke", "none");

        // Dataset 1: Hoofdpolygon (Roze)
        svg.append("path")
            .datum(data1)
            .attr("d", radarLine)
            .style("fill", "rgba(255, 20, 147, 0.5)") // Roze polygon
            .style("stroke", "deeppink")
            .style("stroke-width", "2px");

        // Dataset 2: Confidence interval (Groene schaduw)
        svg.append("path")
            .datum(data2)
            .attr(
                "d",
                d3
                    .lineRadial()
                    .radius((d) => (parseFloat(d.highci) / maxValue) * radius)
                    .angle((d, i) => i * angleSlice)
                    .curve(d3.curveLinearClosed),
            )
            .style("fill", "rgba(34, 139, 34, 0.2)") // Groene transparante schaduw
            .style("stroke", "none");

        svg.append("path")
            .datum(data2)
            .attr(
                "d",
                d3
                    .lineRadial()
                    .radius((d) => (parseFloat(d.lowci) / maxValue) * radius)
                    .angle((d, i) => i * angleSlice)
                    .curve(d3.curveLinearClosed),
            )
            .style("fill", "rgba(34, 139, 34, 0.2)")
            .style("stroke", "none");

        // Dataset 2: Hoofdpolygon (Groen)
        svg.append("path")
            .datum(data2)
            .attr("d", radarLine)
            .style("fill", "rgba(34, 139, 34, 0.5)") // Groene polygon
            .style("stroke", "green")
            .style("stroke-width", "2px");
    }
</script>

<svg bind:this={chartContainer}></svg>

<style>
    svg {
        display: block;
        margin: auto;
    }
</style>
