<script>
  import { onMount } from "svelte";
  import { fetchPosts } from "../lib/apiUtil.js";

// Variabelen
  let actualTimePeriod = []; //tijd periode vanaf period 72

// functie voor filteren van de juiste tijd periode
  async function displayTime() {
    try {
      let data = await fetchPosts();

      let maxTimePeriod = Math.max(
        ...data.map((item) => Number(item.time_period)), );

      actualTimePeriod = data.filter(
        (item) => Number(item.time_period) === maxTimePeriod,);

    // melding voor error 
    } catch (error) {
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
