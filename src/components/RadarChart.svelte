<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
  
    let chartContainer;
    let width = 400;
    let height = 400;
  
    // Dataset 1 (Data punten voor Anxiety)
    let data1 = [
      { axis: "A", value: "13.3", lowci: "8.6", highci: "19.2" },
      { axis: "B", value: "10.1", lowci: "6.5", highci: "14.2" },
      { axis: "C", value: "15.0", lowci: "12.3", highci: "18.7" },
    ];
  
    // Dataset 2 (Data punten voor Depression)
    let data2 = [
      { axis: "A", value: "12.0", lowci: "9.0", highci: "15.0" },
      { axis: "B", value: "11.5", lowci: "8.0", highci: "15.0" },
      { axis: "C", value: "14.2", lowci: "10.0", highci: "18.0" },
    ];
  
    let maxValue = 20;
    let levels = 5;
  
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
        .html("") // Reset de inhoud
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
      // SVG-definities voor gradients
      const defs = svg.append("defs");
  
      // Gradient voor Anxiety (Turquoise → Grijs)
      const anxietyGradient = defs
        .append("linearGradient")
        .attr("id", "anxietyGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");
      anxietyGradient.append("stop").attr("offset", "0%").attr("stop-color", "#40E0D0");
      anxietyGradient.append("stop").attr("offset", "100%").attr("stop-color", "#A9A9A9");
  
      // Gradient voor Depression (Donkerblauw → Paars)
      const depressionGradient = defs
        .append("linearGradient")
        .attr("id", "depressionGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");
      depressionGradient.append("stop").attr("offset", "0%").attr("stop-color", "#00008B");
      depressionGradient.append("stop").attr("offset", "100%").attr("stop-color", "#800080");
  
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
        .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
        .style("stroke", "#999")
        .style("stroke-width", "2px");
  
      axis.append("text")
        .attr("x", (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
        .text((d) => d.axis)
        .style("font-size", "12px")
        .attr("text-anchor", "middle");
  
      // Functie om een polygon te tekenen
      const radarLine = d3
        .lineRadial()
        .radius((d) => (parseFloat(d.value) / maxValue) * radius)
        .angle((d, i) => i * angleSlice)
        .curve(d3.curveCardinalClosed);
  
      // Dataset 1: Anxiety polygon
      svg.append("path")
        .datum(data1)
        .attr("d", radarLine)
        .style("fill", "url(#anxietyGradient)")
        .style("stroke", "#40E0D0")
        .style("stroke-width", "2px")
        .style("fill-opacity", 0.8);
  
      // Dataset 2: Depression polygon
      svg.append("path")
        .datum(data2)
        .attr("d", radarLine)
        .style("fill", "url(#depressionGradient)")
        .style("stroke", "#800080")
        .style("stroke-width", "2px")
        .style("fill-opacity", 0.8);
    }
  </script>
  
  <svg bind:this={chartContainer}></svg>
  
  <style>
    svg {
      display: block;
      margin: auto;
    }
  </style>
  