<script>
    import { onMount } from "svelte";
    import { fetchPosts } from "../lib/apiUtil.js";
  
    let actualTimePeriod = [];
    let TimePeriodAge = [];
  
    async function displayTime() {
      try {
        let data = await fetchPosts();
  
        // Valideer en filter de data
        // let validData = data.filter(item => !isNaN(Number(item.time_period)));
        let maxTimePeriod = Math.max(...data.map(item => Number(item.time_period)));
        actualTimePeriod = data.filter(item => Number(item.time_period) === maxTimePeriod);


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
  

  
  
