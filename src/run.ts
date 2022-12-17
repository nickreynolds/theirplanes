import { agent } from './setup'
import getAirport from './getAirport'
import getFlightData from './getFlightData'
import dotenv from 'dotenv'

import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
let lastKnown: number[] | null = null

const scheduler = new ToadScheduler()
import { issueTakeoff } from './issueCreds'
dotenv.config()
console.log("process.env.KMS_SECRET_KEY: ", process.env.KMS_SECRET_KEY)

const taskFunc = async () => {
    // figure out if one of them has taken off / landed
    // check current vector against last known. should be able to tell if started or stopped moving.s
    // if so, issue VC from Veramo instance (with did = did:ens:theirplanes.eth)
    // then send that VC over DIDComm to did:ens:greenbug.eth
    console.log("vitalik.eth: ", await agent.resolveDid({ didUrl: 'did:ens:vitalik.eth'}))
    console.log("whatever.eth: ", await agent.resolveDid({ didUrl: 'did:ens:goerli:whatever.eth'}))
    console.log("go issue takeoff")
    await issueTakeoff('elon', '123123123', 'Texas')
    //fetch('https://opensky-network.org/api/states/all?icao24=a835af').then((resp) => console.log("response: ", resp))
}

taskFunc()

const task = new AsyncTask(
    'simple task', 
    async () => { 
        // figure out if one of them has taken off / landed
        // check current vector against last known. should be able to tell if started or stopped moving.s
        // if so, issue VC from Veramo instance (with did = did:ens:theirplanes.eth)
        // then send that VC over DIDComm to did:ens:greenbug.eth
        const latLng = await getFlightData('a835af')
        if (!lastKnown && !latLng) {
            // do nothing
            return
        }
        if (latLng && !lastKnown) {
            // just took off
            lastKnown = latLng
            const airport = getAirport(latLng)
        }
        if (!latLng && lastKnown) {
            // just landed
            lastKnown = null
            const airport = getAirport(lastKnown!)
        }
        if (latLng && lastKnown) {
            // flying
            lastKnown = latLng
        }
     },
    (err: Error) => { /* handle error here */ }
)
const job = new SimpleIntervalJob({ seconds: 60, }, task)

scheduler.addSimpleIntervalJob(job)