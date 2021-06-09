import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Settings from '@material-ui/icons/Settings'
import Tooltip from '@material-ui/core/Tooltip'

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
}))(MenuItem);

export function DropDownMenu(props) {
  const actions = props.actions || []  
  const icon = props.icon || <Settings></Settings>
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{marginRight: 10, marginTop: 8}}>
         <IconButton 
         color="secondary" 
         onClick={handleClick}  
         aria-haspopup="true"
         component="span"
         >
          {icon}
        </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
         {actions.map(action => {
         return (
            <Tooltip title = {action.tooltip || ''} placement="left-start">
                <StyledMenuItem alignItems="center" onClick = {() => {
                  action.handleClick()
                  handleClose()}} disabled = {action.disabled} style={{ display: action.hide ? 'none' : 'block' }}>
                {action.icon}    
                <ListItemText primary = {action.label}/>
            </StyledMenuItem>
           </Tooltip>
         )}
         )} 
      </StyledMenu>
    </div>
  );
}
