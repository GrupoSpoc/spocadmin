import { BASE } from './paths.js'
import { getJWT } from '../session/SessionUtil'
import axios from 'axios'

const getAllPending = callback => {
    const options = {
        headers: {
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