import React from "react";

export function BookmarkCardSmall(props) {

    const styleObj = {
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            borderRadius: '14px',
            background: 'white',
            color: 'black',
            padding: '20px 50px',
            marginTop: '30px',
            border: 'solid 2px black',
        },
        innerBox: {
            overflow: 'hidden',
        }
    }

    return (
        <div style={styleObj.container} key={props.itemUrl}> 
            <div style={styleObj.innerBox}>                   
            <h3> <a href={props.itemUrl} target="_blank" rel="noopener noreferrer"> {props.itemUrl} </a> </h3>
            </div>
        </div>

    );
}