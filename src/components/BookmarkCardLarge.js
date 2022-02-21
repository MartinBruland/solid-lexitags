import React from "react";
import { IconButton, Button, Tooltip } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'



export function BookmarkCardLarge(props) {

    const styleObj = {
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '14px',
            background: 'white',
            color: 'black',
            padding: '5%',
            height: '200px',
            width: '60%',
            marginTop: '30px',
            border: 'solid 2px black'
        },
        subContainer1: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '50%',
            height: 'inherit',
        },
        tagsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            height: '50%',
        },
        subContainer2: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 'inherit',
        },
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
        },
        button: {
            color: 'black',
            padding: '1% 5%',
        }

    }

    return (
        <div style={styleObj.container} key={props.data.itemUrl}>
                    
            <div style={styleObj.subContainer1} >

                <h3> <a href={props.data.itemUrl} target="_blank" rel="noopener noreferrer"> {props.data.itemTitle} </a> </h3>

                <p> {props.data.itemDescription} </p>

                 <div style={styleObj.tagsContainer} >
                    {props.data.itemTags.map((tagItem) => (
                        <Tooltip title={tagItem.meaning} onClick={() => props.clickTag(tagItem.word)} >
                            <Button style={styleObj.buttons} variant="outlined" size="small"> {tagItem.word} </Button>
                        </Tooltip>
                     ))}
                </div>
            </div>

            <div style={styleObj.subContainer2} >
                <div style={styleObj.buttonContainer} >
                    <IconButton size="large" aria-label="edit" onClick={() => props.editBookmark(props.data)}> <EditIcon /> </IconButton>
                    <IconButton size="large" aria-label="delete" onClick={() => props.deleteBookmark(props.data)}> <DeleteIcon /> </IconButton>
                </div>
                <Button style={styleObj.button}  variant="outlined" size="small" onClick={() => props.clickTag(props.data.itemCreated.split(',')[0])}> created: {props.data.itemCreated} </Button>


            </div>

        </div>
    );
}