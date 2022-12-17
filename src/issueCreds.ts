import { agent } from "./setup"

export const issueTakeoff = async (name: string, time: string, from: string) => {
    try {
        console.log("get did.")
        const theirPlanesDID = await agent.didManagerGetOrCreate({ provider: 'did:ens', alias: 'theirplanes.eth'})
        console.log("theirPlanesDID: ", theirPlanesDID)
        const cred = await agent.createVerifiableCredential({ 
            credential: {
                issuer: theirPlanesDID.did,
                type: ['PrivateJetTakeoff'],
                credentialSubject: {
                    name,
                    time,
                    from
                }
            },
            // TODO (use 'lds' format, but DID needs to be resolvable for that to work)
            proofFormat: 'jwt'
        })
        console.log("cred: ", cred)
    } catch (ex) {
        console.error(ex)
    }
}

export const issueLanding = async (name: string, time: string, to: string) => {
    try {
        console.log("get did.")
        const theirPlanesDID = await agent.didManagerGetOrCreate({ provider: 'did:ens', alias: 'theirplanes.eth'})
        console.log("theirPlanesDID: ", theirPlanesDID)
        const cred = await agent.createVerifiableCredential({ 
            credential: {
                issuer: theirPlanesDID.did,
                type: ['PrivateJetLanding'],
                credentialSubject: {
                    name,
                    time,
                    to
                }
            },
            // TODO (use 'lds' format, but DID needs to be resolvable for that to work)
            proofFormat: 'jwt'
        })
        console.log("cred: ", cred)
    } catch (ex) {
        console.error(ex)
    }
}