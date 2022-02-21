import React from "react";

export function TabView(props) {

    const styleObj = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '80%',
        }
    }


    if (props.isLoggedIn && props.value === props.index) {
        return (
            <div style={styleObj.container}>
                {props.children}
            </div>
        )
    }else return null
}