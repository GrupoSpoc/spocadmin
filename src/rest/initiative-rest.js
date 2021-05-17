import rp from 'request-promise'
import { BASE } from './paths.js'

const getAllPending = callback => {
    const options = {
        method: 'GET',
        uri: BASE + '/initiative/all',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        json: true
    };

    rp(options)
        .then(response => callback(response))
        .catch(err => console.log(err))
}

export default {
    getAllPending
}