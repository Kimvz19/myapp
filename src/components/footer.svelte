<!-- Html code-->
<!-- Doel van deze code is om de gebruiker meer 
informatie te geven over wat de punten betekenen-->

<!-- HTML code -->
<section class="footer">
    <h3>Betekenis van de punten</h3>
    <h4>Breng de indicatoren van angst en depressie in beeld</h4>
</section>

<!-- Styling css-->
<style>
  
.footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%; /* Flexibele breedte */
    max-width: 800px; /* Maximale breedte */
    margin: auto;
    margin-top: 20px;
    padding: 10px;
    border: 5px solid transparent;
    border-image: linear-gradient(to right, #40e0d0, #a9a9a9, #40e0d0, #a9a9a9) 1;
}

h3, h4 {
    text-align: center;
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
}

h4 {
    font-family: "Montserrat";
    font-optical-sizing: auto;
    font-weight: 200;
    font-style: normal;
    font-size: 15px;
    margin-top: 0;
    margin-bottom: 10px; /* Fout: geen eenheid */
}
</style>
