<!-- imports van componenten-->
<script>
    import Header from "../components/header.svelte";
    import RadarChart from "../components/RadarChart.svelte";
    // import State from "../components/Statefilter.svelte";
    import Tryout from "../components/tryout.svelte";
</script>


<main>
    <Header />
    <!-- <State /> -->
    <Tryout />
    <RadarChart {selectedPost}/>
</main>
