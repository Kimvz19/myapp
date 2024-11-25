<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
  
    let chartContainer;  // Verwijzing naar de container voor de grafiek
    let width = 400;     // Breedte van de grafiek
    let height = 400;    // Hoogte van de grafiek
  
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
  
    let maxValue = 20;  // Maximale waarde voor de schaal
    let levels = 5;     // Aantal niveau cirkels voor de grafiek
  
    onMount(() => {
      createRadarChart(chartContainer);  // Functie aanroepen wanneer de component is geladen
    });
  
    // Functie om de radar grafiek te maken
    function createRadarChart(container) {
      let radius = Math.min(width, height) / 2; // Straal van de grafiek
      let angleSlice = (Math.PI * 2) / data1.length; // Hoek per data punt
  
      // Maak de SVG container voor de grafiek
      let svg = d3
        .select(container)  // Selecteer de container
        .attr("width", width)  // Stel de breedte in
        .attr("height", height)  // Stel de hoogte in
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
      anxietyGradient.append("stop").attr("offset", "0%").attr("stop-color", "#40E0D0");
      anxietyGradient.append("stop").attr("offset", "100%").attr("stop-color", "#A9A9A9");
  
      // Gradient voor Depressie (Donkerblauw → Paars)
      let depressionGradient = defs
        .append("linearGradient")
        .attr("id", "depressionGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");
      depressionGradient.append("stop").attr("offset", "0%").attr("stop-color", "#00008B");
      depressionGradient.append("stop").attr("offset", "100%").attr("stop-color", "#800080");
  
      // Maak de grid niveaus (cirkels)
      svg.selectAll(".grid-level")
        .data(d3.range(1, levels + 1).reverse())  // Maak cirkels voor elk niveau
        .enter()
        .append("circle")
        .attr("class", "grid-level")
        .attr("r", (d) => (radius / levels) * d)  // Straal van de cirkels
        .style("fill", "#CDCDCD")
        .style("stroke", "#999")
        .style("fill-opacity", 0.1);
  
      // Maak de assen en labels
      let axis = svg
        .selectAll(".axis")
        .data(data1)  // Gebruik de data voor de assen
        .enter()
        .append("g")
        .attr("class", "axis");
  
      // Maak de lijnen voor de assen
      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2)) // X-coördinaat van de lijn
        .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2)) // Y-coördinaat van de lijn
        .style("stroke", "#999")
        .style("stroke-width", "2px");
  
      // Voeg de labels voor de assen toe (Punten A, B, C)
      axis.append("text")
        .attr("x", (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))  // X-positie van het label
        .attr("y", (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))  // Y-positie van het label
        .text((d) => d.axis)  // Gebruik de 'axis' naam uit de data
        .style("font-size", "12px")
        .attr("text-anchor", "middle");  // Centreer het label op de lijn
  
      // Functie om een polygon (vorm) te tekenen
      let radarLine = d3
        .lineRadial()
        .radius((d) => (parseFloat(d.value) / maxValue) * radius)  // Zet de waarde om naar de straal
        .angle((d, i) => i * angleSlice)  // Zet de data om naar hoeken
        .curve(d3.curveCardinalClosed);  // Zorg ervoor dat de polygon gesloten is
  
      // Dataset 1: Angst (Anxiety) polygon tekenen
      svg.append("path")
        .datum(data1)  // Gebruik data1 voor Anxiety
        .attr("d", radarLine)
        .style("fill", "url(#anxietyGradient)")  // Gebruik de gedefinieerde gradient
        .style("stroke", "#40E0D0")
        .style("stroke-width", "2px")
        .style("fill-opacity", 0.8);
  
      // Dataset 2: Depressie (Depression) polygon tekenen
      svg.append("path")
        .datum(data2)  // Gebruik data2 voor Depression
        .attr("d", radarLine)
        .style("fill", "url(#depressionGradient)")  // Gebruik de gedefinieerde gradient
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
  