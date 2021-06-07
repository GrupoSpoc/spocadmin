import { BASE } from './paths.js'
import axios from 'axios'
import { getJWT } from '../session/SessionUtil'

const options = () => { 
    return { 
        headers: {'client_id': 'REACTlKld8UY310AQ0OPBsp4K98H51'}
    }
}

const authOptions = () => {
    const opt = options()
    opt.headers['Authorization'] = 'Bearer ' + getJWT()
    return opt
}

const signIn = async (uid, password, callback, errCallback) => {
    const opt = options()
    
    opt.headers['Content-Type'] = 'application/json'
    
    const data = JSON.stringify({
        uid,
        password
    })
    
    axios.post(BASE + '/authenticate/admin', data, opt)

    .then(res => callback(res.data.jwt))
    .catch(err => {
        errCallback(err)
    });
}

const getAllPending = (dateTop, callback) => {
    const opt = authOptions()

    const params = {
        order: 1,
        statusId: 1,
        limit: 4,
        dateTop
    }

    opt.params = params;

    axios.get(BASE + '/initiative/all', opt)

    .then(res => callback(res.data))
    .catch(err => console.log(err));
}

const approve = (initiativeId, callback, errCallback) => {
    const opt = authOptions()

    axios.post(BASE + '/initiative/approve/' + initiativeId, null, opt)

    .then(res => callback(res.data))
    .catch(err => errCallback(err));
}

const reject = (initiativeId, callback, errCallback) => {
    const opt = authOptions()

    axios.post(BASE + '/initiative/reject/' + initiativeId, null, opt)

    .then(res => callback(res.data))
    .catch(err => errCallback(err));
}


export default {
    signIn,
    getAllPending,
    approve,
    reject
}