import axios from "axios"

export default async function getFlightData(icao24: string): Promise<any> {
    const response = await axios.get(`https://opensky-network.org/api/states/all`, {
        headers: {
            'Authorization': `Basic ${process.env.OPEN_SKY_TOKEN}`
        },
        params: {
          icao24: icao24
        }
      });
    
    // Extract the latitude and longitude from the response
    if (response.data.states) {
      console.log("found states: ", response.data.states)
        const latitude = response.data.states[0][6];
        const longitude = response.data.states[0][5];
        return [latitude, longitude]   
    }
    return null
}
