import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import fiwareTitle from '../assets/fiware-title.png'


import Tooltip from '@material-ui/core/Tooltip'
import { useConfirm } from 'material-ui-confirm';


export const NavBar = ({ history, user }) => {
    const confirm = useConfirm();
    return (
        <div className="navBar" style={{width: "100%", padding: 5, margin: "auto", boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)", textAlign:"center"}}>
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{width: "90%", margin: 'auto'}}
            
        >
            <Grid item xs={3} justify="left">
                <img src={fiwareTitle} alt="" style={{ width: '80%' }}/>
            </Grid>
            <Grid item xs={2} justify="right">
                <Tooltip title = "Logout" placement="right-start">
                    <IconButton 
                        tooltip="Logout"
                        size="medium"
                        onClick={() => {
                            confirm({title: "Cerrar sesión", description: "¿Seguro desea cerrar sesión?", cancellationText:"Cancelar"})
                            .then(() => {
                            history.push('/logout')})
                        }}> 
                        <PowerSettingsNewIcon color="secondary"/>
                    </IconButton>
                </Tooltip>
                <p>{user}</p>
            </Grid>                
        </Grid>
        </div> 
        
     );
}
 
