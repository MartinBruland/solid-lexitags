import React from "react";

  import {
    Toolbar,
    Button,
    InputBase,
    Chip
  } from "@material-ui/core";
  
  import SearchIcon from "@material-ui/icons/Search";


export function BookmarkActionBar(props) {

  const styleObj = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    addItemButton: {
      position: 'fixed',
      right: '5%',
      bottom: '5%',
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      fontSize: '30px',
      fontWeight: 'bolder',
      background: '#3b424e',
      color: '#4c5f4a',
    },
    searchbar: {
      borderRadius: '14px',
      width: '50%',
      marginBottom: '30px',
      minHeight: '50px',
      background: '#3b424e',
    }, 
    keywords: {
      color: 'white',
      borderColor: 'white',
      margin: '0 10px;',
    }
  }


    if (props.isLoggedIn && props.tabValue === 0) {
        return  (
          <div style={styleObj.container}>
                     
            
            <Button style={styleObj.addItemButton} variant="contained" color="primary" onClick={props.setBookmarkMethod}> + </Button>
            
            <Toolbar style={styleObj.searchbar}>
                <SearchIcon />
                <InputBase
                  id='search'
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onKeyDown={props.clickSearchbarMethod}
                  fullWidth={true}
                />
              </Toolbar>
    
              <div>
                {props.activeFilter.map((term) => (
                  <Chip style={styleObj.keywords} variant="filled" color='secondary' label={term} onDelete={() => props.removeFilterMethod(term)} />
                ))}
              </div>
    
    
      </div>
    
        )
          } else return null

}