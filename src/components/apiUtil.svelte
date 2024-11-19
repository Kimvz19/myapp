<script>
    import { onMount } from "svelte";

    // Asynchrone functie om posts op te halen
    async function fetchPosts() {
        const url =
            "https://data.cdc.gov/resource/8pt5-q6wp.json?time_period_start_date=2024-01-23T00:00:00.000";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            posts = json; // Sla de opgehaalde data op in de posts variabele
        } catch (error) {
            console.error(error.message);
        }
    }
</script>

<!--https://data.cdc.gov/resource/8pt5-q6wp.json?$limit=1000&$offset=150-->
