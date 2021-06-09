import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import fiwareLogo from '../assets/fiware-logo.png'
import Tooltip from '@material-ui/core/Tooltip'
import { useConfirm } from 'material-ui-confirm';


export const NavBar = ({ history }) => {
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
            <Grid item xs={2} justify="center">
                <img src={fiwareLogo} alt="" style={{width: 100 }}/>
            </Grid>
            <Grid item xs={2} justify="center">
                <Tooltip title = "Logout" placement="right-start">
                    <IconButton 
                        tooltip="Logout"
                        size="large"
                        onClick={() => {
                            confirm({title: "Cerrar sesión", description: "¿Seguro desea cerrar sesión?", cancellationText:"Cancelar"})
                            .then(() => {
                            history.push('/logout')})
                        }}> 
                        <PowerSettingsNewIcon color="secondary"/>
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
        </div> 
        
     );
}
 
