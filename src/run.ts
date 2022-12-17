import { agent } from './setup'
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'

const scheduler = new ToadScheduler()
import dotenv from 'dotenv'
dotenv.config()
console.log("process.env.KMS_SECRET_KEY: ", process.env.KMS_SECRET_KEY)
const task = new AsyncTask(
    'simple task', 
    async () => { 
        // figure out if one of them has taken off / landed
        // check current vector against last known. should be able to tell if started or stopped moving.s
        // if so, issue VC from Veramo instance (with did = did:ens:theirplanes.eth)
        // then send that VC over DIDComm to did:ens:greenbug.eth
        

        //fetch('https://opensky-network.org/api/states/all?icao24=a835af').then((resp) => console.log("response: ", resp))
     },
    (err: Error) => { /* handle error here */ }
)
const job = new SimpleIntervalJob({ seconds: 2, }, task)

scheduler.addSimpleIntervalJob(job)