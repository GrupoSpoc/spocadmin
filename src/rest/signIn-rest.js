import rp from 'request-promise'
import { BASE } from './paths.js'
import fetch from 'node-fetch'
import axios from 'axios'

var myHeaders = new Headers();
myHeaders.append('client_idREACTlKld8UY310AQ0OPBsp4K98H51', "REACTlKld8UY310AQ0OPBsp4K98H51");

const signInOld = async (uid, password, callback) => {
    fetch(BASE + '/authenticate/admin', {
        method: 'POST',
        headers: {
            myHeaders
        },
        body: {
            uid,
            password
        }
    })
    .then(res => res.json())
    .then(json => console.log(json));
}

const options = {
    headers: {'bsp4k98h51': 'control-request',
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

const signIn2 = async (uid, password, callback) => {
    let instance = axios.create();
    instance.defaults.headers.common['jwt'] = uid

    instance.post(BASE + '/authenticate/admin')
            .then(response => {
    console.log('Response of logout', response);
    })
}


export default {
    signIn,
}