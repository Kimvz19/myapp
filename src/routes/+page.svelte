
<!-- adding fonts-->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap" rel="stylesheet">


<!-- html code-->
<h1>De psychologische impact van COVID-19</h1>
<h2>Breng de indicatoren van angst en depressie in beeld</h2>

<!-- imports van componenten-->
<script>
    import D3Chart from "../components/D3Chart.svelte";
    import RadarChart from '../components/RadarChart.svelte';

</script>

<!-- styling van page-->
<style>

h1, h2{
    display: flex;
    justify-content: center;
}

h1{
  font-family: "Montserrat";
  font-optical-sizing: auto;
  font-weight: 300;
  font-style: normal;
}

h2{
  font-family: "Montserrat";
  font-optical-sizing: auto;
  font-weight: 200;
  font-style: normal;
}

</style>



<main>
    <D3Chart />
    <RadarChart />
</main>

