import React from 'react';
import { useState, useEffect } from 'react';
import restClient from '../rest/rest-client'
import { authenticated } from "../session/SessionUtil";
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
//import Toolbar from '@material-ui/core/Toolbar'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip'
import { NavBar } from './NavBar';
import ApproveIcon from '@material-ui/icons/Check'
import RejectIcon from '@material-ui/icons/Clear'
import CameraIcon from '@material-ui/icons/CameraAlt'
import { useConfirm } from 'material-ui-confirm';


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      alignContent: 'center',
      justifyContent: 'center',
     
    },
    paper: {
      width: '90%',
      margin: 'auto',
      marginTop: 100,
      // marginBottom: theme.spacing(2),
      // marginLeft: theme.spacing(2)
    },
    table: {
      minWidth: 750,
      padding: 20
    },
    tableHead:{
      justifyContent:'center'
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
    const [state, setState] = useState({initiatives: []});
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState({}); // para mi esto debería ser {}
    const [displayImagePopup, setDisplayImagePopup] = useState(false)
    const [loading, setLoading] = useState(true)

    // ---- START / PIDO INICIATIVAS AL BACKEND ----
    useEffect(() => {
        if (!authenticated()) {
            history.push("/login");
        }

        async function fetchData() {
            restClient.getAllPending(null, initiativeList => {
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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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
          setLoading(false)
        },
        err => {
          alert("Error aprobando iniciativa: " + err)
          setLoading(false);
        })
      })
    }

    function handleReject(initiative, index) {
      confirm(buildConfirmBody("¿Seguro desea rechazar esta Iniciativa?")).then(() => {
        setLoading(true)
        restClient.reject(initiative._id, res => {
          changeStatusAndDisable(index, 3)
          setLoading(false)
        },
        err => {
          alert("Error rechazando iniciativa: " + err)
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

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }
      
    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
      
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
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



    if (loading) return( 
        <div className={classes.spinner} 
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <CircularProgress></CircularProgress>
        </div>
      )
    return (
        <div className={classes.root}>
          <NavBar history={history}/>
          <Paper className={classes.paper}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="Initiatives"
                aria-label="enhanced table"
                size="small"
              >
                <EnhancedTableHead
                  classes={classes.tableHead}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {stableSort(state.initiatives, getComparator(order, orderBy))
                    .map((initiative, index) => {
                      const enabled = initiative.enabled
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={initiative.id}
                          align
                          selected = {!enabled}
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
                                  disabled={!enabled}> 
                                  <ApproveIcon color={enabled ? "#76ff03" : colorDisabled}/>
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
            </TableContainer>
            </Paper>
            <div className={classes.fab}>
              <Tooltip title = "Cargar más Iniciativas" placement="right-start">
                <Fab
                  color ="secondary" 
                  size = "large" 
                  onClick={fetchMoreInitiatives}
                >
                  <AddIcon/>
                </Fab>
              </Tooltip>
            </div>
          
          { displayImagePopup && <ImagePopup
            initiative={selected}
            handleClose={closeImagePopup}
        />}
        </div>)
}