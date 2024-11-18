<!-- <form class="filterForm">
    <label>
      <input type="checkbox" name="category" value="gender"> Gender
    </label>
    <label>
      <input type="checkbox" name="category" value="state"> State
    </label>
    <label>
      <input type="checkbox" name="category" value="confidence"> Confidence
    </label>
  
    <button type="submit">Filter</button>
  </form>
  
  <div id="results"></div>
  
  <script>
    import { onMount } from 'svelte';
  
    let apiUrl = 'https://data.cdc.gov/resource/8pt5-q6wp.json?$limit=2000&$offset=150';
  
    // Gebruik `onMount` om DOM-events toe te voegen
    onMount(() => {
      const form = document.querySelector('.filterForm');
      
      form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Voorkomt standaard formulierverzending
  
        // Verzamel alle aangevinkte selectievakjes
        const checkboxes = document.querySelectorAll('input[name="category"]:checked');
        const selectedCategories = Array.from(checkboxes).map(cb => cb.value); // Maak een array van geselecteerde waarden
  
        // Genereer de querystring met geselecteerde categorieën
        const queryString = selectedCategories.length > 0 ? `&category=${selectedCategories.join(',')}` : '';
  
        // API URL met filters
        apiUrl = 'https://data.cdc.gov/resource/8pt5-q6wp.json?$limit=2000&$offset=150${queryString}';
  
        // Haal resultaten op en toon deze
        await fetchAndDisplayResults();
      });
    });
  
    // Functie om de API aan te roepen
    const fetchAndDisplayResults = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Netwerkfout');
        }
        const data = await response.json();
  
        // Toon de resultaten in de UI
        displayResults(data);
      } catch (error) {
        console.error('Er is een fout opgetreden:', error);
      }
    };
  
    // Functie om resultaten weer te geven
    function displayResults(data) {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Maak eerdere resultaten leeg
  
      data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = item.name; // Veronderstel dat elk item een 'name' eigenschap heeft
        resultsDiv.appendChild(itemDiv);
      });
    }

  </script>
   -->