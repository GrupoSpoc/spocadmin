import rp from 'request-promise'
import { BASE } from './paths.js'

const signIn = async (uid, password, callback) => {
    const options = {
        method: 'POST',
        uri: BASE + '/admin/login',
        body: {
            uid,
            password
        },
        json: true
    };

    rp(options)
        .then(response => callback(response))
        .catch(err => console.log(err))
}

export default {
    signIn,
}