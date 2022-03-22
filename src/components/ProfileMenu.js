import React from "react";

import {
    Button,
    Switch,
    FormGroup,
    FormControlLabel
  } from "@material-ui/core";






export function ProfileMenu(props) {

    var styleObj = {
      container: {
        position: 'relative',
        display: 'inline-block',
        zIndex: '200',
      },
      profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        border: 'solid 1.5px black',
        borderRadius: '25px',
        height: '30px',
        padding: '5px 15px',
        marginBottom: '4%',
        background: '#4c5f4a',
        maxWidth: '200px',
        overflow: 'hidden',
      },
      text: {
        whiteSpace: 'nowrap',
        color: 'black',
        fontWeight: 'bolder',
      },
      buttonContainer: {
        display: 'none',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
      },
      button: {
        width: '100%',
        background: '#3b424e',
        color: 'black',
        marginBottom: '5px',
        borderRadius: '12px',
        border: 'solid 1px black',
        
      }

    }

    function handleHover(){
      document.getElementById('buttonContainer').style.display = 'block'
    }

    function onMouseLeaveHander() {
      document.getElementById('buttonContainer').style.display = 'none'
    }



    if (props.loggedin) {
    return (

      <div style={styleObj.container} onMouseOver={handleHover} onMouseOut={onMouseLeaveHander} >

        <div style={styleObj.profileContainer}>
          <p style={styleObj.text}>{props.nameOfUser}</p>
        </div>

        <div style={styleObj.buttonContainer} id='buttonContainer' >
        <Button style={styleObj.button} color="primary" onClick={props.sortMethod1}> Sort by Date </Button>
        <Button style={styleObj.button} color="primary" onClick={props.sortMethod2}> Sort by Title </Button>
          
        <Button style={styleObj.button} color="primary" onClick={props.showHelper}>Help</Button>


        <Button style={styleObj.button} color="primary" onClick={props.logoutMethod}> Logout </Button> 

        <Button style={styleObj.button} color="primary"> 
        <FormGroup>
          <FormControlLabel control={<Switch checked={props.optOutState} onChange={(event) => props.optOutMethod(event.target.checked)} />} label="use my data" />
        </FormGroup>              
        
        </Button> 


        
        
      </div>
    </div>
    );
    } else return null;
}