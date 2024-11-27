// API Fetchen 

// Bron van de API : https://data.cdc.gov/NCHS/Indicators-of-Anxiety-or-Depression-Based-on-Repor/8pt5-q6wp/about_data 
//async functie om de API te fetchen 

async function fetchPosts() {
  const url = "https://data.cdc.gov/resource/8pt5-q6wp.json?$limit=1000&$offset=16300";

  try {
    const response = await fetch(url); 
    if (!response.ok) {   //URL fetch response
      throw new Error(`Response status: ${response.status}`); 
    }

    const json = await response.json();
    return json;  
  
  } catch (error) {
    console.error("Error fetching data:", error.message); //Error melding 
  }
}

// Export functie FetchPosts (API)
export { fetchPosts };


