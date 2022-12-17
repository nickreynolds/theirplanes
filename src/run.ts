import { agent } from './setup'
import getAirport from './getAirport'
import getFlightData from './getFlightData'
import dotenv from 'dotenv'

import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
let lastKnown: number[] | null = null

const scheduler = new ToadScheduler()

import { issueLanding, issueTakeoff } from './issueCreds'
import { match } from 'assert'

import config from "./config.json"
console.log("config: ", config)

dotenv.config()
console.log("process.env.KMS_SECRET_KEY: ", process.env.KMS_SECRET_KEY)

const taskFuncRandom = async () => {
    // figure out if one of them has taken off / landed
    // check current vector against last known. should be able to tell if started or stopped moving.s
    // if so, issue VC from Veramo instance (with did = did:ens:theirplanes.eth)
    // then send that VC over DIDComm to did:ens:greenbug.eth
    // console.log("vitalik.eth: ", await agent.resolveDid({ didUrl: 'did:ens:vitalik.eth'}))
    // console.log("whatever.eth: ", await agent.resolveDid({ didUrl: 'did:ens:goerli:whatever.eth'}))

    for(var c of config) {
        console.log("c: ", c)
        // random logic to produce steady stream of VCs for testing
        if (Math.random() < .03) {
            // 2nd parameter 'time' should be 'datetime' in ISO-8601
            await issueTakeoff(c.name, '2028-10-31T23:38:35.000Z', 'Hell')
        } else if (Math.random() < .06) {
            await issueLanding(c.name, '2028-11-01T00:08:14.000Z', 'Earth')
        }
    }

    //fetch('https://opensky-network.org/api/states/all?icao24=a835af').then((resp) => console.log("response: ", resp))
}

const taskFuncReal = async () => {
        // figure out if one of them has taken off / landed
        // check current vector against last known. should be able to tell if started or stopped moving.s
        // if so, issue VC from Veramo instance (with did = did:ens:theirplanes.eth)
        // then send that VC over DIDComm to did:ens:greenbug.eth
        
    for(var c of config) {
        const { icao, name } = c
        const latLng = await getFlightData(icao)
        if (!lastKnown && !latLng) {
            // do nothing
            return
        }
        if (latLng && !lastKnown) {
            // just took off
            lastKnown = latLng
            const airport = await getAirport(latLng)
            issueTakeoff(name, (new Date()).toISOString(), airport)
        }
        if (!latLng && lastKnown) {
            // just landed
            lastKnown = null
            const airport = await getAirport(lastKnown!)
            issueLanding(name, (new Date()).toISOString(), airport)
        }
        if (latLng && lastKnown) {
            // flying
            lastKnown = latLng
        }
    }
}
// taskFuncRandom()
taskFuncReal()
const task = new AsyncTask(
    'simple task', 
    taskFuncReal,
    (err: Error) => { /* handle error here */ }
)
const job = new SimpleIntervalJob({ seconds: 20, }, task)

scheduler.addSimpleIntervalJob(job)