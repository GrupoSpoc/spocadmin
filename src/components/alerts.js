import React from 'react'
import {AppBar, Toolbar} from '@material-ui/core'
import MuiAlert from "@material-ui/lab/Alert"

const severities = ['success', 'warning', 'error', 'info']

export function Alert(severity, msg, close = () => {} ) {
    setTimeout(() => {
        close()
    }, 9000)
    return (
        <AppBar position="fixed">
          <Toolbar>
    <MuiAlert  onClose = {close} elevation={6} variant="filled" severity={severities[severity]}>{msg}</MuiAlert>
    </Toolbar>
    </AppBar>)
}

export default {}
  