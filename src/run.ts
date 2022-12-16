import { agent } from './setup'
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')

const scheduler = new ToadScheduler()
require('dotenv').config()
console.log("process.env.KMS_SECRET_KEY: ", process.env.KMS_SECRET_KEY)
const task = new AsyncTask(
    'simple task', 
    () => { 
        // figure out if one of them has taken off / landed
        // if so, issue VC from Veramo instance (with did = did:ens:theirplanes.eth)
        // then send that VC over DIDComm to did:ens:greenbug.eth


        //fetch('https://opensky-network.org/api/states/all?icao24=a835af').then((resp) => console.log("response: ", resp))
     },
    (err: Error) => { /* handle error here */ }
)
const job = new SimpleIntervalJob({ seconds: 2, }, task)

scheduler.addSimpleIntervalJob(job)