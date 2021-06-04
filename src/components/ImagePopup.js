import React, { Fragment } from "react";
import {
  Button,
  Dialog
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 140,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(3)
  }
}));

export function ImagePopup(props) {
  const initiative = props.initiative;
  const classes = useStyles();

  function close() {
    props.handleClose();
  }

  return (
    <Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={close}
      >
        <DialogContent>
          <div>
            <img src={`data:image/jpeg;base64,${initiative.image}`} alt="initiative" />
          </div>
        </DialogContent>
        <DialogActions style={{justifyContent: 'center'}}>
            <Button variant="outlined" onClick={close} color="primary" autoFocus className={classes.button}>
              Cerrar
            </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
