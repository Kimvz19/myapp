<!-- Beschrijving van Time Filter
  
Time filter heb ik gecreërd omdat de API veelste veel data wilt inladen! 
Namelijk zo'n 16.7900 datapunten van 2024 tot 2020. Hiervoor heb ik gekozen om alleen
de gebruiker de gegevens te laten zien van de laatste periode! -->

<!-- Deze code filters gegevens die worden aangeleverd van de API op de max time_period,
dus de meest actuele time_period-->

<script>
  import { onMount } from "svelte";
  import { fetchPosts } from "../lib/apiUtil.js";

  // Variabelen
  let actualTimePeriod = []; // Meest actuele time_period
  export const ActualTime = actualTimePeriod;

  // Functie voor het filteren van de juiste tijdperiode
  async function displayTime() {
    try {
      //aanroepen van de data uit de API
      let data = await fetchPosts();

      // variabele wordt aangemaakt om de vergelijkinis te kunnen maken voor de uitvoering hieronder
      let maxTimePeriod = Math.max(
        ...data.map((item) => Number(item.time_period)),
      );

      // Filtert op de max time_period > dus de meest recente === aan de hoogste time_period
      actualTimePeriod = data.filter(
        (item) => Number(item.time_period) === maxTimePeriod,
      );
    } catch (error) {
      // Melding voor error
      console.error("Error bij het ophalen van data:", error.message);
    }
  }

  // Roep de functie aan bij het laden van de component
  onMount(() => {
    displayTime();
  });

  // Automatisch opnieuw loggen als de waarde verandert
  $: console.log(actualTimePeriod);
</script>
