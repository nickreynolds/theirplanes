import axios from 'axios';

export default async function getAirport(latLong: number[]): Promise<any> {
  // Make a request to the positionstack API to get the nearest city
  console.log("latLong: ", latLong)
  try {
    const cityResponse = await axios.get(`http://api.positionstack.com/v1/reverse`, {
      params: {
        access_key: process.env.POSITION_STACK_KEY,
        query: latLong.join(',')
      }
    });

    // Extract the city from the response
    return cityResponse.data.data.find((item: any) => item.type === "venue")
  } catch (ex) {
    console.error(ex)
  }
  return "unknown"
}
