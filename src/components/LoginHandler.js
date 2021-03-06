import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState, useContext } from 'react';
import restClient from '../rest/rest-client.js'
import { setJWT, setUser } from '../session/SessionUtil.js'
import CircularProgress from '@material-ui/core/CircularProgress';
import { SessionContext } from './context';
import powered from '../assets/powered.png'


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'CollaborAR Admin '}
      <img src={powered} alt="" style={{ width: '80%', marginTop:10}}/>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const LoginHandler = ({ history }) =>  {
  const classes = useStyles();
  const { alert } = useContext(SessionContext);
  const [uid, setUid] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);


  const handleUidChanged = e => {
    setUid(prev => e.target.value)
  }

  const handlePasswordChanged = e => {
    setPassword(prev => e.target.value)
  }


  const handleSubmit = () => {
     setLoading(true);
     restClient.signIn(uid, password, tokenInfo => {
        setJWT(tokenInfo.jwt)
        setUser(tokenInfo.user.nickname)
        setLoading(false);
        history.push("/")
     },
     err => {
       setLoading(false);
       alert(2, 'Usuario o contrase??a incorrectos')
     })
  }

  const handleSubmitKeypress = e => {
    if (password !== "" && uid !== "") {
      if (e.charCode === 13) {
        handleSubmit()
      }
    }
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="uid"
            label="User"
            name="User"
            autoComplete="User"
            autoFocus
            onChange={handleUidChanged}
            onKeyPress={handleSubmitKeypress}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChanged}
            onKeyPress={handleSubmitKeypress}
          />
          {loading && <div className={classes.fab} style={{marginTop: 20}}><CircularProgress></CircularProgress> </div>}
          {!loading && <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!password || password === "" ||??!uid || uid === ""}
            onClick={handleSubmit}
          >
            Sign In
          </Button>}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}