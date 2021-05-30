import rp from 'request-promise'
import { BASE } from './paths.js'

const signIn = async (uid, password, callback) => {
    const options = {
        method: 'POST',
        uri: BASE + '/authenticate/admin',
        body: {
            uid,
            password
        },
        json: true,
        headers: {
            'client-id': 'REACTlKld8UY310AQ0OPBsp4K98H51'
        }
    };

    rp(options)
        .then(response => callback(response))
        .catch(err => console.log(err))
}

export default {
    signIn,
}