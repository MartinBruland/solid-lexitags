import React from "react";
import { Dialog, DialogContent, DialogContentText } from '@material-ui/core';






export function WordnetWindow(props) {

    const handleClose = () => {
        props.onClose(props.selectedValue); // Updating Window State in App.js.
    };

    return (
        
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
            
        <DialogContent>
          
          <DialogContentText> This window will contain word explanations from wordnet, that can be applied to the tags! </DialogContentText>

        </DialogContent>

      </Dialog>

    )
}