import React from 'react';
import Button from '@material-ui/core/Button';
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
import { DropDownMenu } from './DropDownMenu'
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(2)
    },
    table: {
      minWidth: 750,
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
  }));

export const InitiativeList = ({ history }) =>   {
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

    function addInitiative(i) {
        setState((prevState) => {
            const initiatives = [...prevState.initiatives];
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

    function handleApprove(initiative) {
      console.log(initiative._id + " aprobada!")
    }

    function handleReject(initiative) {
      console.log(initiative._id + " rechazada!")
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
        <div className={classes.root}
          style={{
            position: 'absolute', left: '50%', top: '10%',
            transform: 'translate(-50%, -10%)'
        }}>
          <Paper className={classes.paper}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="Initiatives"
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {stableSort(state.initiatives, getComparator(order, orderBy))
                    .map((initiative, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={initiative.id}
                        >
                          <TableCell component="th" scope="row" padding="none">
                            {initiative._id}
                          </TableCell>
                          <TableCell align="right">{formatDate(initiative.date)}</TableCell>
                          <TableCell align="right">{initiative.description}</TableCell>
                          <TableCell align="right">{initiative.nickname}</TableCell>
                          <TableCell align="right">{initiative.status_id}</TableCell>
                          <DropDownMenu
                            actions = {[
                              {
                                label:'Ver',
                                handleClick: () => { handleInitiativeSelected(initiative) }
                              },
                              {
                                label:'Aprobar',
                                disabled: false, // todo cuando se rechaza / aprueba
                                handleClick: () => handleApprove(initiative)
                              },
                              {
                                label:'Rechazar',
                                disabled: false,
                                handleClick: () => handleReject(initiative),
                              }
                            ]}
                          />
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <Toolbar className= {classes.bottomToolbar}>
                  <Button 
                    className = {classes.button}
                    variant ="contained" 
                    color ="primary" 
                    size = "medium" 
                    onClick={fetchMoreInitiatives}>
                    Cargar más Iniciativas
                  </Button>
                  <Button 
                    className = {classes.button}
                    variant ="contained" 
                    color ="primary" 
                    size = "medium" 
                    onClick={() => history.push('/logout')}>
                    LOGOUT
                  </Button> 
            </Toolbar>
          </Paper>
          { displayImagePopup && <ImagePopup
            initiative={selected}
            handleClose={closeImagePopup}
        />}
        </div>)
}