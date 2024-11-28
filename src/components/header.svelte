<!-- Toevoegen van fonts -->
<!-- fonts van google -->

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Montserrat weight 300 -->
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap"
  rel="stylesheet"
/>

<!-- Montserrat weight 200 -->
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap"
  rel="stylesheet"
/>

<!-- Montserrat weight 100 -->
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap"
  rel="stylesheet"
/>

<!-- HTML code -->
<section>
  <h1>De psychologische impact van COVID-19</h1>
  <h2>Breng de indicatoren van angst en depressie in beeld</h2>
</section>

<!-- Styling -->
<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  h1,
  h2 {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  h1 {
    font-family: "Montserrat";
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
    font-size: 30px;
    padding: 5px; /* Ruimte tussen tekst en rand */
    width: 585x;
    margin-top: 15px;
    margin-bottom: 9px;

    /* Gradient voor de tekst */
    background: linear-gradient(to right, #40e0d0, #a9a9a9, #00008b, #800080);
    -webkit-background-clip: text; /* Voor Webkit browsers (zoals Safari) */
    background-clip: text; /* Voor andere moderne browsers */
    color: transparent; /* de tekst transparant zodat de gradient zichtbaar wordt */

    /* Gradient voor de rand */
    border: 5px solid transparent; /* Transparante rand */
    border-image: linear-gradient(to right, #40e0d0, #a9a9a9, #00008b, #800080)
      1; /* Gradient rand */
  }

  h2 {
    font-family: "Montserrat";
    font-optical-sizing: auto;
    font-weight: 200;
    font-style: normal;
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 10;
  }
</style>
