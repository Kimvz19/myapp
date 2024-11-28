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
<!-- Titel en subtitel-->
<section class="header">
  <h1>De psychologische impact van COVID-19</h1>
  <h2>
    Meetpunten statistieken van zelfverzekerheid - symtomen anxiety and
    Depression
  </h2>
</section>



<!-- Styling CSS-->
<style>
  .header {
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
    font-weight: 300;
    font-style: normal;
    font-size: 30px;
    padding: 5px; 
    margin-top: 15px;
    margin-bottom: 9px;

    /* Gradient voor de tekst */
    background: linear-gradient(to right, #40e0d0, #a9a9a9, #00008b, #800080);
    -webkit-background-clip: text; /* Voor Webkit browsers (zoals Safari) */
    background-clip: text; /* Voor andere moderne browsers */
    color: transparent; 

    /* Gradient voor de rand */
    border: 5px solid transparent; 
    border-image: linear-gradient(to right, #40e0d0, #a9a9a9, #00008b, #800080)
      1; /* Gradient rand */
  }

  h2 {
    font-family: "Montserrat";
    font-optical-sizing: auto;
    font-weight: 200;
    font-style: normal;
    font-size: 18px;
    margin-top: 0px;
    margin-bottom: 10px;
  }
</style>
