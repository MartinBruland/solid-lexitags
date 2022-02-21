import React from "react";

import {
    Button
  } from "@material-ui/core";

import {
    LoginButton
  } from "@inrupt/solid-ui-react";




export function LoginWindow(props) {

  const styleObj = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#ffffff',
      color: '#2f3542',
      borderRadius: '14px',
      width: '30%',
      padding: '5%',
      border: 'solid 2px black',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
    },
    button: {
      width: '200px',
      background: '#6952bd',
      color: '#ffffff',
      marginBottom: '8%',
      fontWeight: 'bolder',
      border: 'solid 1px black',
    },
    paragraph: {
      fontWeight: 'bolder',
      marginBottom: '15px',
      borderBottom: 'solid 2px black',
      paddingBottom: '6px',
      width: '50%',
      textAlign: 'center',
    },
    headerText: {
      fontSize: '30px',
      marginBottom: '40px',
      color: '#6952bd',
    }
  }


    if (!props.isLoggedIn) {
        return (
          <div style={styleObj.container} >
            <h2 style={styleObj.headerText}>Login with Solid </h2>
            <p style={styleObj.paragraph}>Select Pod Provider</p>
            <div style={styleObj.buttonContainer}>
              <LoginButton oidcIssuer="https://broker.pod.inrupt.com" redirectUrl={window.location.href}>
                    <Button style={styleObj.button} color="primary"> Pod Spaces </Button>
              </LoginButton>
  
                <LoginButton oidcIssuer="https://inrupt.net" redirectUrl={window.location.href}>
                    <Button style={styleObj.button} color="primary"> Inrupt </Button>                
                </LoginButton>
  
                <LoginButton oidcIssuer="https://solidcommunity.net" redirectUrl={window.location.href}>
                    <Button style={styleObj.button} color="primary"> Solid Community </Button>
                </LoginButton>
  
                <LoginButton oidcIssuer="https://localhost:8443/" redirectUrl={window.location.href}>
                    <Button style={styleObj.button} color="primary"> NSS </Button>                
                </LoginButton>
              </div>
          </div>
        )
      } else return null;
}