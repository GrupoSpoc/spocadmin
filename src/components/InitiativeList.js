import React from 'react';
import { useState, useEffect, useContext } from 'react';
import restClient from '../rest/rest-client'
import { authenticated, getUser } from "../session/SessionUtil";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {EnhancedTableHead} from './HeadCells';
import { ImagePopup } from './ImagePopup'
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import { IconButton } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip'
import { NavBar } from './NavBar';
import ApproveIcon from '@material-ui/icons/Check'
import RejectIcon from '@material-ui/icons/Clear'
import CameraIcon from '@material-ui/icons/CameraAlt'
import { useConfirm } from 'material-ui-confirm';
import { SessionContext } from './context';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      alignContent: 'center',
      justifyContent: 'center',
     
    },
    paper: {
      width: '90%',
      margin: 'auto',
      marginTop: 40,
    },
    table: {
      minWidth: 750,
      padding: 20
    },
    tableHead:{
      justifyContent:'center',
      backgroundColor: '#2196f3',
      color: theme.palette.common.white
    },
    EngineIcon:{
      margin: '5%'
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    spinner: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
    bottomToolbar:{
      justifyContent: 'space-between'
    },
    fab:{
     width: '100%',
     textAlign: 'center',
     marginTop:'1%'
    }
  }));

const colorDisabled = "#424242"

const statusMap = new Map()
statusMap.set(1, 'Pendiente')
statusMap.set(2, 'Aprobada')
statusMap.set(3, 'Rechazada')

const invalidFiwareCharacters = ['<', '>', '"', "'", '=', ';', '(', ')']

export const InitiativeList = ({ history }) =>   {
    const confirm = useConfirm()
    const classes = useStyles();
    const { alert } = useContext(SessionContext);
    const [state, setState] = useState({initiatives: []});
    const [selected, setSelected] = useState({});
    const [emptyList, setEmptyList] = useState(false)
    const [displayImagePopup, setDisplayImagePopup] = useState(false)
    const [displayRejectDialog, setDisplayRejectDialog] = useState(false)
    const [rejectMotive, setRejectMotive] = useState('')
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(''); 
    const [lastBatch, setLastBatch] = useState(false)
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);

    // ---- START / PIDO INICIATIVAS AL BACKEND ----
    useEffect(() => {
        if (!authenticated()) {
            history.push("/login");
        } else {
          setUser(getUser());
          search();
        }
    }, []);

    function search() {
      setLoading(true)
      setState({initiatives: []})

      restClient.getAllPending(dateFrom, dateTo, initiativeBatch => {
        setEmptyList(initiativeBatch.initiatives.length == 0)
        initiativeBatch.initiatives.forEach(addInitiative)
        setLastBatch(initiativeBatch.last_batch)
        setLoading(false)
      }, err => handleError("Error", err))
    }

    function buildConfirmBody (message) {
      return {title: 'Confirmación', description: message, cancellationText: 'Cancelar'}
    }

    function addInitiative(i) {
        setState((prevState) => {
            const initiatives = [...prevState.initiatives];
            i.enabled = true
            initiatives.push(i);
            return { ...prevState, initiatives };
        });
    }

    function fetchMoreInitiatives() {
      let lastInitiativeDate;

      if (state.initiatives.length > 0) {
          const lastInitiative = state.initiatives[state.initiatives.length - 1]
          lastInitiativeDate = lastInitiative.date
      }

      setLoading(true)
      restClient.getAllPending(lastInitiativeDate, dateTo, initiativeBatch => {
        initiativeBatch.initiatives.forEach(addInitiative)
        setLastBatch(initiativeBatch.last_batch)
        setEmptyList(state.initiatives.length == 0)
        setLoading(false)
      })
    }

    const handleInitiativeSelected = (initiative) => {
        setSelected(prev => initiative)
        openImagePopup();
    };

    function openImagePopup() {
        setDisplayImagePopup(true)
    };
    
    function closeImagePopup() {
        setDisplayImagePopup(false)
    };

    function openRejectDialog() {
      setDisplayRejectDialog(true)
    };

    function closeRejectDialog() {
      setDisplayRejectDialog(false)
    };

    const handleRejectMotiveChange = e => {
      const value = e.target.value
      if (value.length <= 130) {
        setRejectMotive(prev => value)
      }
    }
  

    function handleApprove(initiative, index) {
      confirm(buildConfirmBody("¿Seguro desea aprobar esta Iniciativa?")).then(() => {
        setLoading(true)
        restClient.approve(initiative._id, res => {
          changeStatusAndDisable(index, 2)
          alert(3, `Iniciativa ${initiative._id} aprobada`)
          setLoading(false)
        }, err => handleError("Error aprobando iniciativa", err))
      })
    }

    function handleReject(selected) {
      if (motiveIsValid()) {
        setLoading(true)

        const {initiative} = selected;
        const {index} = selected;
      
        restClient.reject(initiative._id, rejectMotive, res => {
          changeStatusAndDisable(index, 3)
          alert(3, `Iniciativa ${initiative._id} rechazada`)
          setLoading(false)
        }, err => handleError("Error rechazando iniciativa", err))
      }
    }

    const motiveIsValid = () => {
      const invalidCharacter = invalidFiwareCharacters.filter(ch => rejectMotive.includes(ch))[0]
      
      if (invalidCharacter) {
        alert(2, `El caracter ${invalidCharacter} es inválido`)
        return false;
      }

      return true;
    }

    function handleError(message, err) {
      setLoading(false);
      if (err.response) {
        alert(2, message + ": " + err.response.data)
      } else {
        alert(1, "La sesión ha caducado. Inicie sesión nuevamente")
        history.push("/logout")
      }
    }

    function changeStatusAndDisable(index, status_id) {
      // 1. Make a shallow copy of the items
      let initiatives = [...state.initiatives];
      // 2. Make a shallow copy of the item you want to mutate
      let initiative = {...initiatives[index]};
      // 3. Replace the property you're intested in
      initiative.enabled = false;
      initiative.status_id = status_id
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      initiatives[index] = initiative;
      // 5. Set the state to our new copy
      setState({initiatives});
    }

    function formatDate(d) {
      const date = new Date(d)
      let formattedDate = ''
  
      const separated = date.toLocaleDateString().split('/')
      const month = separated[0]
      const day = separated[1]
      const year = separated[2]
  
      const separator = '-'
  
      formattedDate += day >= 10 ? day : `0${day}` 
      formattedDate += separator
      formattedDate += month >= 10 ? month : `0${month}` 
      formattedDate += separator
      formattedDate += year

      formattedDate += ' ' + date.toLocaleTimeString()
  
      return formattedDate
  }

  const handleDateFromChanged = e => {
    setDateFrom(e.target.value);
  };

  const handleDateToChanged = e => {
    setDateTo(e.target.value);
  };



    return (
        <div className={classes.root}>
          <NavBar history={history} user={user}/>
          <Paper className={classes.paper}>
          <Toolbar variant="dense" style={{padding:5, marginBottom: 30}}>
            <TextField
              id="dateFrom"
              label="Desde"
              type="datetime-local"
              defaultValue={dateFrom}
              onChange={handleDateFromChanged}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              style={{padding:10}}
            />

            <TextField
              id="dateTo"
              label="Hasta"
              type="datetime-local"
              defaultValue={dateTo}
              onChange={handleDateToChanged}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              style={{padding:10}}
            />
            <Tooltip title = "Buscar" placement="right-start" style={{marginTop:5}} >
                <Fab
                  color ="primary" 
                  size = "medium" 
                  onClick={search}
                >
                  <SearchIcon variant = "outlined"/>
                </Fab>
            </Tooltip>
          </Toolbar>

            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="Initiatives"
                aria-label="enhanced table"
                size="small"
              >
                <EnhancedTableHead
                />
                <TableBody>
                  {state.initiatives
                    .map((initiative, index) => {
                      const enabled = initiative.enabled

                      let rowStyle;

                      if (enabled) {
                        rowStyle = {backgroundColor: 'white'};
                      } else if (initiative.status_id == 2) {
                        rowStyle = {backgroundColor: '#d0e7b7', opacity:'70%'};
                      } else rowStyle = {backgroundColor: '#f2aeae', opacity:'70%'}

                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={initiative.id}
                          align
                          style={rowStyle}
                        >
                          <TableCell component="th" scope="row" padding="5%">
                            {initiative._id}
                          </TableCell>
                          <TableCell align="left">{formatDate(initiative.date)}</TableCell>
                          <TableCell align="left">{initiative.description}</TableCell>
                          <TableCell align="left">{initiative.nickname}</TableCell>
                          <TableCell align="center">{statusMap.get(initiative.status_id)}</TableCell>
                          <TableCell>
                            <Tooltip title = "Ver imagen" placement="right-start">
                              <IconButton 
                                  size="large"
                                  onClick={() => handleInitiativeSelected(initiative)}> 
                                  <CameraIcon color="primary"/>
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title = "Aprobar" placement="right-start">
                              <IconButton 
                                  size="large"
                                  onClick={() => handleApprove(initiative, index)}
                                  disabled={!enabled}
                                  > 
                                  <ApproveIcon color={enabled ? "primary" : colorDisabled}/>
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title = "Rechazar" placement="right-start">
                              <IconButton 
                                  size="large"
                                  onClick={() => {
                                    setSelected({initiative: initiative, index: index })
                                    openRejectDialog()}
                                  }
                                  disabled={!enabled}> 
                                  <RejectIcon color={enabled ? "secondary" : colorDisabled}/>
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <Dialog open={displayRejectDialog} onClose={closeRejectDialog} aria-labelledby="form-dialog-title" maxWidth = 'sm' fullWidth>
                <DialogTitle id="form-dialog-title">Rechazar Iniciativa</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Ingrese el motivo de rechazo.
                  </DialogContentText>
                  <TextField
                    value={rejectMotive}
                    autoFocus
                    margin="dense"
                    id="motive"
                    onChange={handleRejectMotiveChange}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeRejectDialog} color="primary">
                    Cancelar
                  </Button>
                  <Button onClick={() => {
                    handleReject(selected)
                    closeRejectDialog()
                  }} 
                  color="primary"
                  disabled={rejectMotive.length <= 0}
                  >
                    Aceptar
                  </Button>
                </DialogActions>
              </Dialog>
              {emptyList && 
                <div className={classes.fab}>
                  <p>No hay iniciativas pendientes de aprobación</p>
                </div>}
            </TableContainer>
            </Paper>
            {loading &&  <div className={classes.fab} style={{marginTop: 20}}><CircularProgress></CircularProgress> </div>}
            {!loading && <div className={classes.fab}>
              <Tooltip title = "Cargar más Iniciativas" placement="right-start" style={{marginTop:5}} >
                <Fab
                  color ="secondary" 
                  size = "large" 
                  onClick={fetchMoreInitiatives}
                  disabled={lastBatch}
                >
                  <AddIcon/>
                </Fab>
              </Tooltip>
            </div>}
          
          {displayImagePopup && <ImagePopup
            initiative={selected}
            handleClose={closeImagePopup}
        />}
        </div>)
}