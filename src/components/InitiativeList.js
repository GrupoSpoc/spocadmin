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
import Tooltip from '@material-ui/core/Tooltip'
import { NavBar } from './NavBar';
import ApproveIcon from '@material-ui/icons/Check'
import RejectIcon from '@material-ui/icons/Clear'
import CameraIcon from '@material-ui/icons/CameraAlt'
import { useConfirm } from 'material-ui-confirm';
import { SessionContext } from './context';


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


export const InitiativeList = ({ history }) =>   {
    const confirm = useConfirm()
    const classes = useStyles();
    const { alert } = useContext(SessionContext);
    const [state, setState] = useState({initiatives: []});
    const [selected, setSelected] = useState({});
    const [emptyList, setEmptyList] = useState(false)
    const [displayImagePopup, setDisplayImagePopup] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(''); 

    // ---- START / PIDO INICIATIVAS AL BACKEND ----
    useEffect(() => {
        if (!authenticated()) {
            history.push("/login");
        }

        setUser(getUser());

        async function fetchData() {
            restClient.getAllPending(null, initiativeList => {
                setEmptyList(initiativeList.length == 0)
                initiativeList.forEach(addInitiative)
                setLoading(false)
            })
        }
        fetchData();
    }, []);

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
      let dateTop;

      if (state.initiatives.length > 0) {
          const lastInitiative = state.initiatives[state.initiatives.length - 1]
          dateTop = lastInitiative.date
      }

      setLoading(true)
      restClient.getAllPending(dateTop, initiativeList => {
        initiativeList.forEach(addInitiative)
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

    function handleApprove(initiative, index) {
      confirm(buildConfirmBody("¿Seguro desea aprobar esta Iniciativa?")).then(() => {
        setLoading(true)
        restClient.approve(initiative._id, res => {
          changeStatusAndDisable(index, 2)
          alert(3, `Iniciativa ${initiative._id} aprobada`)
          setLoading(false)
        },
        err => {
          alert(2, "Error aprobando iniciativa: " + err)
          setLoading(false);
        })
      })
    }

    function handleReject(initiative, index) {
      confirm(buildConfirmBody("¿Seguro desea rechazar esta Iniciativa?")).then(() => {
        setLoading(true)
        restClient.reject(initiative._id, res => {
          changeStatusAndDisable(index, 3)
          alert(3, `Iniciativa ${initiative._id} rechazada`)
          setLoading(false)
        },
        err => {
          alert(2, "Error rechazando iniciativa: " + err)
          setLoading(false);
        })
      })
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



    return (
        <div className={classes.root}>
          <NavBar history={history} user={user}/>
          <Paper className={classes.paper}>
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
                                  onClick={() => handleReject(initiative, index)}
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
              {emptyList && 
                <div className={classes.fab}>
                  <p>No hay iniciativas pendientes de aprobación</p>
                </div>}
            </TableContainer>
            </Paper>
            {loading &&  <div className={classes.fab} style={{marginTop: 20}}><CircularProgress></CircularProgress> </div>}
            {!loading && <div className={classes.fab}>
              <Tooltip title = "Cargar más Iniciativas" placement="right-start" style={{marginTop:5}}>
                <Fab
                  color ="secondary" 
                  size = "large" 
                  onClick={fetchMoreInitiatives}
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