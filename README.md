# Indicatoren voor Angst en depressie als gevolg van Covid-19
Readme geschreven door Kim, 6 weken project: 07-10 tot 27-07
## Tech track Information Design 

### Beschrijving
Voor dit project is er een datavisualisatieontwerp gemaakt waarbij de data wordt opgehaald uit een dynamisch API, er wordt gebruik gemaakt van filters en de input van de gebruiker, om zo het ontwerp van de data te visualiseren naar voorkeur van de gebruiker.

De input van de gebruiker wordt op verschillende manieren gevraagd in het ontwerp, namelijk; 
1) De gebruiker vult state in uit Amerika
2) De gebruiker mag zelf kiezen van welke personen hij/zij de gegevens van wil bekijken

Om de gebruiker meer te informeren over de data zijn er gebruiksvriendelijke feedback punten toegevoegd om ervoor te zorgen dat het gebruik van de ontwerp goed verloopt; 
1) De gebruiker krijgt feedback van een button als de data is gevonden (groen of rood)
2) De gebruiker krijgt een Radar chart te zien als de gegevens zijn opgehaald, als de gegevens niet gevonden kunnen worden of een andere error zich afspeelt, krijgt de gebruiker een melding te zien om de input gegevens opnieuw in te vullen, error + problem solving.
Ook staan er in de code console.log(..) opties verwerkt, om zo snel te kunnen onderzoeken waar een probleem zich zou afspelen. Dit maakt de geschreven code ook gebruiksvriendelijker als een ander persoon mijn code zou ondernemen. 

### Doelen
Mijn doel van dit project waren meer ervaring op te doen met Javascript, fetchen van een dynamische API, chart maken met D3, leren omgaan met data filteren extc. 
Ik heb veel geleerd tijdens dit project en zeer trots op het eindresultaat. Het project is nooit af, dus ik ga zeker door met dit project om het uit te breiden en verder te verbeteren. 

### Installatie 
Het project is beschikbaar online met de bijbehorende link.
De deployment host voor dit project is Vercel gekoppeld aan Github repo. 

### Componenten & libraries 
In dit project heb ik gebruik gemaakt van componenten en libraries. De componenten in dit project: 
* header.svelte
* main.svelte (met daarin de time filter, state filter & D3 chart)
* footer.svelte

De libraries: 
* apiUtil.js (wordt gebruikt om API te fetchen)

En extra:
* +page.svlete
Deze heb ik aangemaakt omdat ik hierin mijn componenten inlaad. Dit maakt de import van de componenten erg overzichtelijk!

### Toekomst plannen voor het project
De toekomst plannen voor dit project is om meer filter opties toe te voegen. Ook zou ik meer variaties willen toevoegen op het gebied van charts. Ik zou een pie chart willen toevoegen of een barchart. Of juist iets heel anders, een map van Amerika met de states en de daarbijhorende statistieken. Dit zou 1 van mijn toekomst plannen kunnen zijn. Aangezien de API dynamisch is, zou ik ook meerdere tijdsperiodes kunnen verwerken in de visualisatie, maar voor als nog blijft het voor dit project nu bij de laatste meest actuele tijdsperiode.

### Codestijl 
Voor dit project heb ik verschillende codetalen geschreven. Ook heb ik gebruik gemaakt van een framework Svelte & D3 gebruikt voor het creeëren van een radar chart. 
Ik heb gebruik gemaakt van : 
* Html
* CSS
* Javascript
* D3
* Svelte

### Bronnen 
* Bron API : https://data.cdc.gov/NCHS/Indicators-of-Anxiety-or-Depression-Based-on-Repor/8pt5-q6wp/about_data
* Bron URL API limiet oplossing : https://dev.socrata.com/foundry/data.cdc.gov/8pt5-q6wp
* Bron updaten variabele met nieuwe waardes : https://stackoverflow.com/questions/59231590/svelte-what-does-mean
* Bron index : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
* index code voorbeeld opzet : https://chatgpt.com/share/67478f19-6e84-8000-a1fc-3d480dbd1c15

### Radar chart bronnen
* voorbeeld spider chart : https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
* voorbeeld radar chart : https://www.react-graph-gallery.com/radar-chart
* voorbeeld visualisation radar chart : https://datavizcatalogue.com/methods/radar_chart.html
   * https://blog.scottlogic.com/2011/09/23/a-critique-of-radar-charts.html
   * https://graves.cl/radar-chart-d3/
* Bron Radar basis code : https://chatgpt.com/share/67479563-e218-8000-8f8b-96dc05e6cc7c
  * https://chatgpt.com/share/67479d0c-9468-8000-9442-50b1abcc9bfa
* Bron kleuren : https://thebigstory.nl/psychologie-van-kleur/
  * https://linku.nl/kleurenpsychologie/


