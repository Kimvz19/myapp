<!-- MAIN bestand-->
<!-- In deze code wordt er gefilterd op tijd_periode, state, index & radar chart
wordt getekend als alle gegevens kloppen!-->

<!-- Javascript code-->
<script>
    // Imports
    // zorgt ervoor de code pas plaatsvind als alles is ingeladen
    import { onMount } from "svelte";
    import * as d3 from "d3";

    //Import API Fetch voor ophalen van data
    import { fetchPosts } from "../lib/apiUtil.js";

    // variabelen voor gebruik radar chart
    let result1 = null;
    let result2 = null;
    let chartContainer;

    // Variabelen voor filteren
    let actualTimePeriod = [];
    let filteredPosts = [];
    let stateFilter = "hawaii"; //default state
    let dataFound = true; //boolan voor filter status
    let index1 = null;
    let index2 = null;
    let selectedPost = {};

    // eerste filter functie
    // functie fetcht met meest actuele tijd periode
    async function displayTime() {
        try {
            // Data ophalen van APi
            let data = await fetchPosts();

            // Deze optie mapt een nieuwe lijst met array's en kijkt naar de tijd_periode
            let maxTimePeriod = Math.max(
                ...data.map((item) => Number(item.time_period)),
            );

            // Filtert op de max time_period > dus de meest recente === aan de hoogste time_period
            actualTimePeriod = data.filter(
                (item) => Number(item.time_period) === maxTimePeriod,
            );

            // hier wordt de actule tijd lijst gefiltered op de state
            // default state staat op hawaii
            //om te voorkomen dat er foutmeldingen komen als er
            //geen gebruik wordt gemaakt van hoofdletters
            filteredPosts = actualTimePeriod.filter(
                (post) =>
                    post.state.toLowerCase() === stateFilter.toLowerCase(),
            );
            dataFound = filteredPosts.length > 0;

            // error melding
        } catch (error) {
            console.error("Error fetching data:", error.message);
            filteredPosts = [];
            dataFound = false;
        }
    }

    // Tweede functie
    // functie om index van de lijst te selecteren
    async function displayRange(personIndex) {
        // deze code is er om te checken of filteredPosts is uitgevoerd, zo niet
        // dan komt er een foutmleding
        if (filteredPosts.length === 0) {
            console.error(
                "geen data beschikbaar, zorg dat displayTime() uitgevoerd is.",
            );
            return null;
        }

        // voor de persoon index wordt de array ingevuld met de values
        if (personIndex >= 0 && personIndex < filteredPosts.length) {
            selectedPost = filteredPosts[personIndex];
            return {
                // de values die in de array komen
                confidence_interval: selectedPost.confidence_interval,
                lowci: selectedPost.lowci,
                highci: selectedPost.highci,
                quartile_range: selectedPost.quartile_range,
                phase: selectedPost.phase,
                value: selectedPost.value,
            };

            // foutmelding + problem solving
        } else {
            return "<p> Geen geldig persoon gevonden, kies een lager nummer!</p>";
        }
    }

    // Derde functie
    // Functie om data voor de radar chart op te bouwen
    function createRadarData(selectedPost) {
        // functie zorgt ervoor dat de data uit selected post
        // bruikbaar is in de radar chart
        // De return is de uitkomst
        return [
            {
                axis: "Confidence Interval",
                value: selectedPost.confidence_interval,
            },
            { axis: "Low CI", value: selectedPost.lowci },
            { axis: "High CI", value: selectedPost.highci },
            { axis: "Quartile Range", value: selectedPost.quartile_range },
            { axis: "Phase", value: selectedPost.phase },
            { axis: "Value", value: selectedPost.value },
        ];
    }

    // Vierde functie
    // Functie om twee indexes met data te vergelijken
    async function compareIndexes() {
        await displayTime(); // Wacht op displayTime() voordat er verder wordt gegaan

        // hier wordt gekeken of index1 en 2 gegevens hebben
        if (
            index1 === null ||
            index2 === null ||
            !dataFound ||
            filteredPosts.length === 0
        ) {
            console.error("Error, geen gegevens van index1 of index2!");
            return;
        }

        // html element wordt hier geselecteerd
        let outputDiv = document.querySelector(".resultOutput");

        //kijken of index in de lijst valt van filtered post
        let index1Valid = index1 >= 0 && index1 < filteredPosts.length;
        let index2Valid = index2 >= 0 && index2 < filteredPosts.length;

        if (index1Valid && index2Valid) {
            // Haal de data op voor beide indexes/personen
            result1 = await displayRange(index1);
            result2 = await displayRange(index2);

            console.log("Vergelijking:", result1, result2);

            // Maak de radar chart met de gestructureerde data
            let data1 = createRadarData(result1);
            let data2 = createRadarData(result2);
            //controle, wat zit er in de data1 en data2
            console.log(data1, data2);

            // Verwijder het bericht wanneer de grafiek wordt getekend
            if (outputDiv) {
                outputDiv.style.display = "none"; // Verberg het bericht
            }

            // Nu kan de radar chart setup functie worden aangeroepen
            setupRadarChart(data1, data2);

            // als de gegevens niet in de gefilterde post vallen dan komt er deze error.
        } else {
            outputDiv.innerHTML = "<p>Kies een lager nummer!</p>";
        }
    }

    // Vijfde functie
    // Radar chart setup functie aangepast om data door te geven
    async function setupRadarChart(data1, data2) {
        let messageContainer = document.getElementById("message-container");

        //! = niet waar
        if (!data1 || !data2 || !chartContainer) {
            console.error("Data missing or chart container not available.");
            return;
        }

        // Verwijder het bericht wanneer de grafiek wordt getekend
        if (messageContainer) {
            messageContainer.style.display = "none"; // Verberg het bericht
        }

        // roept functie aan met data1 en data2
        createRadarChart(chartContainer, data1, data2);
    }

    // Zesde functie
    // Radar chart creation functie aangepast
    function createRadarChart(container, data1, data2) {
        //afmetingen van de radar chart
        let width = 700,
            height = 850,
            maxValue =
            //maxvalue is gebaseerd op de  value, anders valt de data buiten de radar chart
                Math.max(
                    d3.max(data1.map((d) => parseFloat(d.value))),
                    d3.max(data2.map((d) => parseFloat(d.value))),
                ) * 1.1, // zorgt voor 10% extra ruimte op de grafiek 
            levels = 10; // aantal cirkels dat wordt getekend in de grafiek 

        // berekening radius en hoeken
        let radius = Math.min(width, height) / 2; //de grootste cirkel van de radar chart
        let angleSlice = (Math.PI * 2) / data1.length; //hoek tussen assen

        //aanmaken van svg radar chart
        let svg = d3
            .select(container)
            .attr("width", width)
            .attr("height", height)
            .html("")
            .append("g") // zorgt dat de radar chart in het midden komt van svg
            .attr("transform", `translate(${width / 2}, ${height / 2 + 50})`);

        let defs = svg.append("defs");

        // kleur radients, heb persoon1 anxiety genoemd en persoon 2 depression
        // in verband met de betekenis van de kleuren
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


        // schaal van de cirkels weer te geven in de radar chart
        svg.selectAll(".grid-level")
            .data(d3.range(1, levels + 1).reverse())
            .enter()
            .append("circle")
            .attr("class", "grid-level")
            .attr("r", (d) => (radius / levels) * d)
            .style("fill", "#CDCDCD")
            .style("stroke", "#999")
            .style("fill-opacity", 0.1);

        // waardes van de cirkels
        svg.selectAll(".grid-label")
            .data(d3.range(1, levels + 1).reverse())
            .enter()
            .append("text")
            .attr("class", "grid-label")
            .attr("x", 0)
            .attr("y", (d) => -((radius / levels) * d))
            .text((d) => ((maxValue / levels) * d).toFixed(1))
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style("fill", "#666");


        // tekenen van radar chart
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
                    (radius + 25) * Math.cos(angleSlice * i - Math.PI / 2),
            )
            .attr(
                "y",
                (d, i) =>
                    (radius + 25) * Math.sin(angleSlice * i - Math.PI / 2),
            )
            .text((d) => d.axis)
            .style("font-size", "12px")
            .attr("text-anchor", "middle");

        // radarlijnen
        let radarLine = d3
            .lineRadial()
            .radius((d) => (parseFloat(d.value) / maxValue) * radius)
            .angle((d, i) => i * angleSlice);

        // tekenen van data 1 path
        svg.append("path")
            .data([data1])
            .attr("class", "radar-chart-line")
            .attr("d", radarLine)
            .style("stroke", "url(#anxietyGradient)")
            .style("stroke-width", 2)
            .style("fill", "url(#anxietyGradient)")
            .style("fill-opacity", 0.5)
            .style("stroke-opacity", 1); // Volledige opacity

        // tekenen van data 2 path 
        svg.append("path")
            .data([data2])
            .attr("class", "radar-chart-line")
            .attr("d", radarLine)
            .style("stroke", "url(#depressionGradient)")
            .style("stroke-width", 2)
            .style("fill", "url(#depressionGradient)")
            .style("fill-opacity", 0.5)
            .style("stroke-opacity", 1); // Volledige opacity

        // Voeg data-punten toe op de assen
        //voor data 1
        svg.selectAll(".data-point1")
            .data(data1)
            .enter()
            .append("circle")
            .attr("class", "data-point1")
            .attr(
                "cx",
                (d, i) =>
                    radius *
                    (parseFloat(d.value) / maxValue) *
                    Math.cos(angleSlice * i - Math.PI / 2),
            )
            .attr(
                "cy",
                (d, i) =>
                    radius *
                    (parseFloat(d.value) / maxValue) *
                    Math.sin(angleSlice * i - Math.PI / 2),
            )
            .attr("r", 4)
            .style("fill", "#40E0D0")
            .style("stroke", "#000")
            .style("stroke-width", 1.5);

        //voor data 2
        svg.selectAll(".data-point2")
            .data(data2)
            .enter()
            .append("circle")
            .attr("class", "data-point2")
            .attr(
                "cx",
                (d, i) =>
                    radius *
                    (parseFloat(d.value) / maxValue) *
                    Math.cos(angleSlice * i - Math.PI / 2),
            )
            .attr(
                "cy",
                (d, i) =>
                    radius *
                    (parseFloat(d.value) / maxValue) *
                    Math.sin(angleSlice * i - Math.PI / 2),
            )
            .attr("r", 4)
            .style("fill", "#800080")
            .style("stroke", "#000")
            .style("stroke-width", 1.5);
    }

    // zorgt ervoor dat de code wordt uitgevoerd nadat die functie is uitgevoerd
    onMount(async () => {
        await displayTime();
    });
</script>

<!-- HTML Code -->
<div class="content-data">
    <p>Data in {stateFilter}</p>

    <!-- gebruiker input voor de state -->
    <input
        class="input-field"
        type="text"
        bind:value={stateFilter}
        placeholder="Enter state"
    />

    <!-- Filter posts button -->
    <button on:click={displayTime}>Filter Posts</button>

    <!-- status state gevonden ja = groen , nee = rood -->
    <button
        class="status-button"
        style="background-color: {dataFound ? 'green' : 'red'}"
    >
        {#if dataFound}
            <!-- Green check mark if data is found -->
            <svg width="15" height="17" viewBox="0 0 12 12" fill="none">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6 12C6.78793 12 7.56815 11.8448 8.2961 11.5433C9.02405 11.2417 9.68549 10.7998 10.2426 10.2426C10.7998 9.68549 11.2417 9.02405 11.5433 8.2961C11.8448 7.56815 12 6.78793 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 -1.17411e-08 6 0C4.4087 2.37122e-08 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.88258 11.3679 4.4087 12 6 12ZM5.84533 8.42667L9.17867 4.42667L8.15467 3.57333L5.288 7.01267L3.80467 5.52867L2.862 6.47133L4.862 8.47133L5.378 8.98733L5.84533 8.42667Z"
                    fill="#14AE5C"
                />
            </svg>
        {:else}
            <!-- Red cross if no data is found -->
            <svg width="15" height="12" viewBox="0 0 12 12" fill="none">
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

    <p>vs</p>

    <input
        class="input-field"
        type="number"
        bind:value={index2}
        placeholder="Enter person"
        min="0"
    />

    <button on:click={compareIndexes}>Vergelijk</button>

    <!-- Result output -->
    <div class="resultOutput"></div>
</div>

<!-- radar chart-->
<!-- enigste id op deze pagina-->
<div id="message-container">
    Vul de gegevens in om de radar chart te tekenen!
</div>

<svg bind:this={chartContainer} class="radar-chart"></svg>

<div class="legend-container">
    <div class="legend-item">
        <span class="legend-color1"></span>
        <span>persoon {index1}</span>
    </div>
    <div class="legend-item">
        <span class="legend-color2"></span>
        <span>persoon {index2}</span>
    </div>
</div>

<!------------->
<!-- Styling -->
<!------------->
<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
/>

<style>
    .content-data {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    p {
        margin-bottom: 10px;
        margin-right: 10px;
    }

    button,
    p,
    .input-field,
    #message-container {
        font-family: "Montserrat";
        font-weight: 200;
        font-style: normal;
        font-size: 20px;
        margin-left: 10px;
        height: 38px;
    }

    .input-field {
        margin: 10px;
        padding: 8px;
        font-size: 14px;
        height: 20px;
    }

    .status-button {
        width: 37px;
        height: 35px;
        font-size: 14px;
        border-radius: 5px;
        border-style: none;
        text-align: center;
        margin-right: 50px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .resultOutput {
        font-family: "Montserrat";
        margin-top: 20px;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 8px;
    }

    #message-container {
        display: flex;
        justify-content: center;
        margin-top: 200px;
        margin-bottom: 150px;
        color: #7a187a;
    }

    svg {
        display: block;
        justify-content: center;
        align-content: center;
        margin: auto;
    }

    .legend-container {
        display: flex;
        justify-content: left;
        flex-direction: column;
        position: absolute;
        bottom: 30px; 
        right: 30px; 
        text-align: left;
        font-size: 16px; 
        background-color: #ffffff;
        border: 2px solid #ccc; 
        border-radius: 10px; 
        padding: 15px; 
    }

    .legend-item {
        display: flex;
        align-items: center; 
        margin-bottom: 10px; 
    }

    .legend-color1,
    .legend-color2 {
        width: 30px;
        height: 30px; 
        margin-right: 15px;
        border: 1px solid #000; 
    }

    .legend-color1 {
        background: linear-gradient(to right, #40e0d0, #a9a9a9);
    }

    .legend-color2 {
        background: linear-gradient(to right, #00008b, #800080);
    }
</style>
