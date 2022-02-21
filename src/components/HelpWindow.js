import React from "react";
import { Dialog, DialogContent, DialogContentText } from '@material-ui/core';


export function HelpWindow(props) {

    const handleClose = () => {
        props.onClose(props.selectedValue);  // Updating Window State in App.js.
    };

    return (

        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
            
        <DialogContent>
          
          <DialogContentText> Bookmarklet: Drag the following link to your bookmarks toolbar: "LINK" </DialogContentText>

        </DialogContent>

      </Dialog>

    )
}