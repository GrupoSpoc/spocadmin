import { BASE } from './paths.js'
import axios from 'axios'


const options = {
    headers: {
    'client_id': 'REACTlKld8UY310AQ0OPBsp4K98H51',
    'Content-Type': 'application/json'}
  };

const signIn = async (uid, password, callback) => {
    const data = JSON.stringify({
        uid,
        password
    })
    axios.post(BASE + '/authenticate/admin', data, options)

    .then(res => callback(res.data.jwt))
    .catch(err => console.log(err));
}

export default {
    signIn,
}