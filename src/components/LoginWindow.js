import React from "react";

import {
    Button
  } from "@material-ui/core";

  import {
    login
  } from "@inrupt/solid-client-authn-browser";



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


  const handleLogin = (e, podprovider) => {

    e.preventDefault();

    login({
      redirectUrl: window.location.href,
      oidcIssuer: podprovider,
      clientName: "Lexitags"
    });
  };





    if (!props.isLoggedIn) {
        return (
          <div style={styleObj.container} >
            <h2 style={styleObj.headerText}>Login with Solid </h2>
            <p style={styleObj.paragraph}>Select Pod Provider</p>
            <div style={styleObj.buttonContainer}>

              <Button style={styleObj.button} color="primary" onClick={(e) => handleLogin(e, 'https://broker.pod.inrupt.com')}> Pod Spaces </Button>
              <Button style={styleObj.button} color="primary" onClick={(e) => handleLogin(e, 'https://inrupt.net')}> Inrupt </Button>
              <Button style={styleObj.button} color="primary" onClick={(e) => handleLogin(e, 'https://solidcommunity.net')}> Solid Community </Button>
              <Button style={styleObj.button} color="primary" onClick={(e) => handleLogin(e, 'https://localhost:8443/')}> NSS </Button>

              </div>
          </div>
        )
      } else return null;
}