<!-- Html code-->
<!-- Doel van deze code is om de gebruiker meer 
informatie te geven over wat de punten betekenen-->

<!-- HTML code -->
<section class="footer">
    <h3>Betekenis van de punten</h3>

    <ul>
        <li>
            <span class="term">confidence interval</span>
            <span class="description">Betrouwbaarheids interval</span>
        </li>
        <li>
            <span class="term">Low CI</span>
            <span class="description">Minimale waarde confidence interval</span>
        </li>
        <li>
            <span class="term">High CI</span>
            <span class="description">Maximale waarde confidence interval</span>
        </li>
        <li>
            <span class="term">Quartile Range</span>
            <span class="description"
                >Verschil tussen Q3 en Q1, spreiding van 50% middelste waarden</span
            >
        </li>
        <li>
            <span class="term">Phase</span>
            <span class="description">Periode in het proces</span>
        </li>
        <li>
            <span class="term">Value</span><span class="description"
                >Meetpunt confidence van persoon</span
            >
        </li>
    </ul>
</section>

<!-- Styling css-->
<style>
    .footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%; /* Flexibele breedte */
        max-width: 1000px; /* Maximale breedte */
        margin: auto;
        margin-top: 20px;
        padding: 10px;
        border: 5px solid transparent;
        border-image: linear-gradient(
                to right,
                #40e0d0,
                #a9a9a9,
                #40e0d0,
                #a9a9a9
            )
            1;
    }

    h3 {
        font-family: "Montserrat";
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
        font-size: 20px;
        padding: 5px;
        width: 585px; /* Correcte breedte */
        margin-top: 5px;
        margin-bottom: 9px;
        background: linear-gradient(to right, #000000, #800080);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-align: center;
    }

    ul {
        display: flex;
        list-style: none;
        margin: 0;
    }

    li {
        display: flex;
        flex-direction: column;

        font-family: "Montserrat";
        font-optical-sizing: auto;
        font-weight: 200;
        font-style: normal;
        font-size: 15px;
        margin-top: 0;
        margin-bottom: 10px;
        padding: 15px;
    }

    .term {
        font-weight: bold;
        color: #2c3e50; /* Donkerblauw */
    }

    .description {
        color: #555;
        font-style: italic;
    }
</style>
