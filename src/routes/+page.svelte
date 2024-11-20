<!-- imports van componenten-->
<script>
    import Header from "../components/header.svelte";
    import D3Chart from "../components/D3Chart.svelte";
    import RadarChart from '../components/RadarChart.svelte';
    import Filteroptions from "../components/filteroptions.svelte";
    import Filter from "../components/filter.svelte";
    import Time from "../components/Timefilter.svelte";

    
</script>

<main>
    <Header />
    <Filter />
    <D3Chart />
    <RadarChart />
    <Filteroptions />
    <Time />
</main>

