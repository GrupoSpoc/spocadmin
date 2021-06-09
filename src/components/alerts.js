import React from 'react'
import {AppBar} from '@material-ui/core'
import MuiAlert from "@material-ui/lab/Alert"

const severities = ['success', 'warning', 'error', 'info']

export function Alert(severity, msg, close = () => {} ) {
    setTimeout(() => {
        close()
    }, 4000)
    return (

    <AppBar position="fixed">
        <MuiAlert  position="fixed" onClose = {close} elevation={1} variant="filled" severity={severities[severity]}>{msg}</MuiAlert>
    </AppBar>

)
}

export default {}
  