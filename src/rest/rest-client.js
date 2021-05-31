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

const signIn = async (uid, password, callback) => {
    const opt = options()
    
    opt.headers['Content-Type'] = 'application/json'
    
    const data = JSON.stringify({
        uid,
        password
    })
    
    axios.post(BASE + '/authenticate/admin', data, opt)

    .then(res => callback(res.data.jwt))
    .catch(err => console.log(err));
}

const getAllPending = callback => {
    const opt = authOptions()
    
    axios.get(BASE + '/initiative/pending', opt)

    .then(res => callback(res.data))
    .catch(err => console.log(err));
}

export default {
    signIn,
    getAllPending
}