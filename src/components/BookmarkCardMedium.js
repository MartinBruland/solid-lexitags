import React from "react";
import { Button } from "@material-ui/core";

export function BookmarkCardMedium(props) {

    const styleObj = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderRadius: "14px",
            background: "white",
            color: "black",
            padding: "5%",
            minHeight: "150px",
            height: 'auto',
            width: "100%",
            marginTop: "30px",
            overflow: "hidden",
            border: 'solid 2px black',
        },
        tagsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            width: '100%',
        },
        paragraph: {
            padding: '3% 0'
        }
        

    }
    return (
    <div style={styleObj.container}key={props.data.itemUrl}>

        <h3> <a href={props.data.itemUrl} target="_blank" rel="noopener noreferrer"> {props.data.itemUrl} </a> </h3>
        
        <p style={styleObj.paragraph}> Times bookmarked: {props.data.timesBookmarked} </p>

        <div style={styleObj.tagsContainer}>
            {props.data.itemTags.map((tag) => (
                <Button variant="outlined" size="small"> {tag.word}, {tag.timesTagged} </Button>
            ))}
        </div>

    </div>

    );
}