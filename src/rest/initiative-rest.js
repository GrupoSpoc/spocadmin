import rp from 'request-promise'
import { BASE } from './paths.js'
import { getJWT } from '../session/SessionUtil'
import axios from 'axios'

const getAllPendingOLD = callback => {
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


const getAllPending = callback => {

    const jwtHeaderName = `bearer${getJWT()}end`

    const options = {
        headers: {'bsp4k98h51': 'control-request',
        'client_id': 'REACTlKld8UY310AQ0OPBsp4K98H51',
        'Authorization': 'Bearer ' + getJWT()}
      };
    
    axios.get(BASE + '/initiative/pending', options)

    .then(res => callback(res.data))
    .catch(err => console.log(err));
}

export default {
    getAllPending
}