import { agent } from "./setup"

export const issueTakeoff = async (name: string, time: string, from: string) => {
    const theirPlanesDID = await agent.didManagerGetOrCreate({ provider: 'did:web', alias: 'theirplanes.eth'})
    return await agent.createVerifiableCredential({ 
        credential: {
            issuer: theirPlanesDID.,
            type: ['PrivateJetTakeoff'],
            credentialSubject: {
                name,
                time,
                from
            }
        },
        proofFormat: 'lds'
    })
}

export const issueLanding = async (name: string, time: string, to: string) => {
    return await agent.createVerifiableCredential({ 
        credential: {
            issuer: 'did:web:theirplanes.eth',
            type: ['PrivateJetLanding'],
            credentialSubject: {
                name,
                time,
                to
            }
        },
        proofFormat: 'lds'
    })
}