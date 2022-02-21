import React from "react";
import { Button, Tooltip, TextField, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';


export function AddBookmarkWindow(props) {

    const handleClose = () => {
        props.onClose(props.selectedValue);  // Updating Window State in App.js.
        props.cancelPost();
    };

    return (

        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">

        <DialogTitle id="form-dialog-title"> Add Bookmark </DialogTitle>        
        
        <DialogContent>
            
            <TextField
              autoFocus
              margin="dense"
              id="input_addbookmark_title"
              label="Name"
              defaultValue={props.bookmark.itemTitle}
              fullWidth
            />

            <TextField
              margin="dense"
              id="input_addbookmark_description"
              label="Description"
              defaultValue={props.bookmark.itemDescription}
              fullWidth
            />

            <TextField
              margin="dense"
              id="input_addbookmark_url"
              label="URL"
              defaultValue={props.bookmark.itemUrl}
              fullWidth
            />

            <TextField 
              margin="dense"
              id="input_addbookmark_tags"
              label="Tags"
              fullWidth
              onKeyDown={props.setTag}
            />

            <div>  
              {props.bookmark.itemTags.map((item) =>

                <Tooltip title={item.meaning}>
                  <Chip variant="outlined" label={item.word} onDelete={() => props.deleteTag(item)} onClick={props.wordnetWindowFunc}/>
                </Tooltip>
                             
              )} 
            </div>

          </DialogContent>

          <DialogActions>
                                
            <Button onClick={handleClose} color="primary"> Cancel </Button>
            
            <Button onClick={props.setBookmark} color="primary"> Add </Button>

          </DialogActions>

        </Dialog>



    )
}