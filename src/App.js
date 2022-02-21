import React, { useState } from "react";

import {
  Tab,
  Tabs
} from "@material-ui/core";


import ReactWordcloud from 'react-wordcloud';

import {
  useSession,
  SessionProvider
} from "@inrupt/solid-ui-react";

import {
  fetch,
  getDefaultSession,
  onLogin,
  handleIncomingRedirect
} from "@inrupt/solid-client-authn-browser";


import {
  createSolidDataset,
  createThing,
  saveSolidDatasetAt,
  getSolidDataset,
  getThing,
  getThingAll,
  getStringNoLocale,
  buildThing,
  setThing,
  removeThing,
  getSolidDatasetWithAcl,
  createAclFromFallbackAcl,
  saveAclFor,
  access,
  getUrl,
  getUrlAll
} from "@inrupt/solid-client";



// APP COMPONENTS
import { TabView } from "./components/TabView";
import { BookmarkActionBar } from "./components/BookmarkActionBar";
import { ProfileMenu } from "./components/ProfileMenu";
import { LoginWindow } from "./components/LoginWindow";
import { AddBookmarkWindow } from "./components/AddBookmarkWindow";
import { HelpWindow } from "./components/HelpWindow";
import { WordnetWindow } from "./components/WordnetWindow";
import { BookmarkCardLarge } from "./components/BookmarkCardLarge";
import { BookmarkCardMedium } from "./components/BookmarkCardMedium";
import { BookmarkCardSmall } from "./components/BookmarkCardSmall";





function SolidApp() {

  // UX CONTROLLERS:
  const [value, setValue] = useState(0);
  const [inputWindow, setInputWindow] = useState(false);
  const [helpWindow, setHelpWindow] = useState(false);
  const [wordnetWindow, setWordnetWindow] = useState(false);

  // FILTERING:
  const [activeFilter, setActiveFilter] = useState([]);
  const [selectedBookmark, setSelectedBookmark] = useState({ itemTags: [] });

  // SOLID POD BACKEND:
  const { session, sessionRequestInProgress } = useSession();
  

  const [podUser, updatePodUser] = useState({
    webID: getDefaultSession().info.webId,
    podURL: "",
    isLoggedIn: getDefaultSession().info.isLoggedIn,
    userName: ''
  });


  const [dataset, updateDataset] = useState([]);
  const [dataobject, updateDataObject] = useState([]);
  
  const [allUsersBookmarks, updateAllUsersBookmarks] = useState([]);
  const [topKBookmarks, updateTopKBookmarks] = useState([]);
  const [topKTags, updateTopKTags] = useState([]);
  const [bookmarksByTag, updateBookmarksByTag] = useState([]);






  
  // PREFIX
  const thingType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
  
  const thingCreated = 'http://schema.org/dateCreated';
  const thingModified = 'http://schema.org/dateModified';

  const thingTitle = 'http://schema.org/Thing/alternateName';
  const thingDescription = 'http://schema.org/Thing/description';
  const thingUrl = 'http://schema.org/Thing/url';
  const thingTags = 'http://schema.org/Thing/disambiguationDescription';

  const thingWord = 'http://schema.org/Thing/Word';
  const thingMeaning = 'http://schema.org/Thing/Meaning';

  const thingTypeDataset = 'http://schema.org/Dataset';
  const thingTypeBookmark = 'http://schema.org/Bookmark';
  const thingTypeTag = 'http://schema.org/Tag';



  onLogin(async() => {
    await finishLogin()
  });








// B E N C H M A R K  -- T E S T I N G -- S E C T I O N //

// Triplestore
function benchmarkTriplestore() {

  // Set timer.

  // Create Query ?

  // Call Endpoint

  // Check data

  // Preprocess data in same format as Lexitags.

  // Print data.

  // Check time.

}

// SOLD PODS
function benchmarkSolidPods() {}





  




/* ------------------------------ SOLID ADMIN --------------------------------------------- */

// SAVE WEBID OF USER TO FILE IN APPLICATION POD.
 async function saveWebIdToLexitagsPOD() {
  
  const lexitagsPODURL = "https://lexitagspod.inrupt.net/appusers/datafile"; // LOCATION OF FILE IN APPLICATION POD.

  var existingDataset = await getSolidDataset(lexitagsPODURL); // GET DATASET FROM APPLICATION POD.
  
  const newThing = buildThing(createThing({ name: `${podUser.webID}` })) // CREATE THING.
    .addUrl(thingType, thingTypeDataset)
    .build();

  existingDataset = setThing(existingDataset, newThing); // ADD OR UPDATE DATASET WITH THING.

  await saveSolidDatasetAt( lexitagsPODURL, existingDataset );  

}


// GET WEBID'S OF ALL USERS.
async function getAllWebIdFromLexitagsPOD() {

  const lexitagsPODURL = "https://lexitagspod.inrupt.net/appusers/datafile"; // LOCATION OF FILE IN APPLICATION POD.
  
  var existingDataset = await getSolidDataset(lexitagsPODURL); // GET DATASET FROM APPLICATION POD.

  const thing = getThingAll(existingDataset); // GET ALL THINGS IN DATASET.
  
  var allWebId = [] // WILL CONTAIN WEBID'S OF ALL USERS.

  thing.forEach(item => { // ITERATE EACH ALL THING.

    allWebId.push(item.url.split("https://lexitagspod.inrupt.net/appusers/datafile#")[1]); // STORE EACH THING / WEBID.
    
  });

  return allWebId // RETURN LIST OF WEBID'S.

}









/* ------------------------------ SOLID CRUD METHODS  --------------------------------------------- */
  // SOLID CRUD METHODS - GET FROM POD.
  async function solidGet(saveLocation) {

    const dataset = await getSolidDataset(saveLocation, { fetch: fetch }); // GET DATASET FROM LOCATION.
    return dataset; // RETURN DATASET.

  }

  // WILL BE EXECUTED ONCE, WHEN NO DATASET EXISTS IN USERS POD.
  async function setupDataset(saveLocation) {

    // CREATE NEW DATASET.
    let newDataset = createSolidDataset(); 
    
    // Connect to URL
    let newThing = buildThing(createThing({ url: saveLocation }))
    .addUrl(thingType, thingTypeDataset)
    .build();     
    newDataset = setThing(newDataset, newThing);

    // Save to Pod.
    const savedSolidDataset = await saveSolidDatasetAt(
      saveLocation,
      newDataset,
      { fetch: fetch }
    );


    // SET NECESSARY ACCESS PERMISSIONS ON DATASET.
    access.getAccessForAll( podUser.podURL, "agent", {fetch: session.fetch} ) // GET ACCESS FOR DATASET.
    .then(response => console.log(response))
    .catch(async () => {  // CATCH ERROR -> 404 NOT FOUND -> NO ACL -> CREATE, SET, SAVE.

      const myDatasetWithAcl = await getSolidDatasetWithAcl(podUser.podURL, {fetch: session.fetch});
      const datasetWithAcl = createAclFromFallbackAcl(myDatasetWithAcl)
      await saveAclFor(myDatasetWithAcl, datasetWithAcl, {fetch: session.fetch});
    
    })
    .finally(() => {  // SET PUBLIC ACCESS ON DATASET.

      access.setPublicAccess( podUser.podURL, { read: true, append: true, write: true, controlRead: true, controlWrite: true }, { fetch: session.fetch } ).then(response => console.log(response))

    })
    
    saveWebIdToLexitagsPOD() // STORE THE USERS WEBID IN APPLICATION-POD.

    return savedSolidDataset;
  }

// SOLID CRUD METHODS - CREATE TO POD.
  async function solidCreate(item, saveLocation) {
    
    var existingDataset = dataset; // LOAD EXISTING DATASET FROM STATE.

    // ADD BOOKMARK TO DATASET.
    var bookmarkItem = {
      itemId: item.itemId,
      itemType: thingTypeBookmark,
      itemCreated: new Date().toLocaleString('en-US'),
      itemTitle: item.itemTitle,
      itemDescription: item.itemDescription,
      itemUrl: item.itemUrl,
      itemTags: item.itemTags
    };
    

    // Build new thing and add to dataset
    let newThing = buildThing(createThing({ url: saveLocation + '#Bookmark/' + bookmarkItem.itemId  }))  
    .addUrl(thingType, bookmarkItem.itemType)   
    .addStringNoLocale(thingCreated, bookmarkItem.itemCreated)
    .addStringNoLocale(thingTitle, bookmarkItem.itemTitle)
    .addStringNoLocale(thingDescription, bookmarkItem.itemDescription)
    .addStringNoLocale(thingUrl, bookmarkItem.itemUrl)
    .build();
    existingDataset = setThing(existingDataset, newThing);


    // CONNECT BOOKMARK TO DATASET.
    let newThingConnect = getThing(existingDataset,  saveLocation );
    newThingConnect = buildThing(newThingConnect)
    .addUrl('http://www.schema.org/Contains', saveLocation + '#Bookmark/' + bookmarkItem.itemId   )
    .build();
    existingDataset = setThing(existingDataset, newThingConnect);


    for (let tagCnt = 0; tagCnt < bookmarkItem.itemTags.length; tagCnt++) {

      const tagWord = bookmarkItem.itemTags[tagCnt].word;
      const tagMeaning = bookmarkItem.itemTags[tagCnt].meaning;
      const tagId = 'Tag/' + tagWord

      // ADD TAG TO DATASET.
      const thing_tag = buildThing(createThing({ url: saveLocation +'#' + tagId }))        
      .addStringNoLocale(thingWord, tagWord)
      .addStringNoLocale(thingMeaning, tagMeaning)
      .addUrl(thingType, thingTypeTag)
      .build();
      existingDataset = setThing(existingDataset, thing_tag);

      // CONNECT TAG TO BOOKMARK.
      let thingTagConnect = getThing(existingDataset,  saveLocation + '#Bookmark/' + bookmarkItem.itemId   );
      thingTagConnect = buildThing(thingTagConnect)
      .addUrl(thingTags, saveLocation + '#' + tagId)
      .build();
      existingDataset = setThing(existingDataset, thingTagConnect);

    }

    const updatedDataset = await saveSolidDatasetAt( // UPDATE DATASET IN POD.
      saveLocation,
      existingDataset,
      { fetch: fetch }
    );

    // RELOAD DATA IN VIEW.
    updateDataset(updatedDataset) // UPDATE DATASET IN STATE.
    const dataobj = preprocessDataset(updatedDataset) // RETRIEVE DATA FROM DATASET.
    updateDataObject(dataobj) //UPDATE RETRIEVED DATA IN STATE.
    
  }




  // SOLID CRUD METHODS - POST TO POD.
  async function solidUpdate(item, saveLocation) {

    var existingDataset = dataset; // LOAD EXISTING DATASET FROM STATE.

    // ADD BOOKMARK TO DATASET.
    var bookmarkItem = {
      itemId: item.itemId,
      itemModified: new Date().toLocaleString('en-US'),
      itemTitle: item.itemTitle,
      itemDescription: item.itemDescription,
      itemUrl: item.itemUrl,
      itemTags: item.itemTags
    };


    let newThing = buildThing(getThing( existingDataset, saveLocation + '#Bookmark/' + bookmarkItem.itemId  ))  
    .setStringNoLocale(thingModified, bookmarkItem.itemModified)   
    .setStringNoLocale(thingTitle, bookmarkItem.itemTitle)
    .setStringNoLocale(thingDescription, bookmarkItem.itemDescription)
    .setStringNoLocale(thingUrl, bookmarkItem.itemUrl)
    .removeAll(thingTags)
    .build();
    existingDataset = setThing(existingDataset, newThing); // ADD OR UPDATE DATASET WITH NEW THING.


    for (let tagCnt = 0; tagCnt < bookmarkItem.itemTags.length; tagCnt++) {

      const tagWord = bookmarkItem.itemTags[tagCnt].word;
      const tagMeaning = bookmarkItem.itemTags[tagCnt].meaning;
      const tagId = 'Tag/' + tagWord

      // ADD TAG TO DATASET.
      const thing_tag = buildThing(createThing({ url: saveLocation +'#' + tagId }))        
      .addStringNoLocale(thingWord, tagWord)
      .addStringNoLocale(thingMeaning, tagMeaning)
      .addUrl(thingType, thingTypeTag)
      .build();
      existingDataset = setThing(existingDataset, thing_tag);

      // CONNECT TAG TO BOOKMARK.
      let thingTagConnect = getThing(existingDataset,  saveLocation + '#Bookmark/' + bookmarkItem.itemId  );
      thingTagConnect = buildThing(thingTagConnect)
      .addUrl(thingTags, saveLocation + '#' + tagId)
      .build();
      existingDataset = setThing(existingDataset, thingTagConnect);

  }

  const updatedDataset = await saveSolidDatasetAt( // UPDATE DATASET IN POD.
      saveLocation,
      existingDataset,
      { fetch: fetch }
    );

    // RELOAD DATA IN VIEW.
    updateDataset(updatedDataset) // UPDATE DATASET IN STATE.
    const dataobj = preprocessDataset(updatedDataset) // RETRIEVE DATA FROM DATASET.
    updateDataObject(dataobj) //UPDATE RETRIEVED DATA IN STATE.

  }

  // SOLID CRUD METHODS - DELETE FROM POD.
  async function solidDelete(thing, saveLocation) {

    var existingDataset = dataset;  // LOAD EXISTING DATASET FROM STATE.

    // Deletes thing.
    const thingLocation = saveLocation + '#Bookmark/' + thing.itemId; // CREATE PATH TO THING IN DATASET.
    const existingThing = getThing(existingDataset, thingLocation); // GET THING FROM DATASET.
    existingDataset = removeThing(existingDataset, existingThing); // REMOVE THING FROM DATASET.

    // Removes Connection to Dataset.
    const datasetThing = buildThing(getThing(existingDataset, saveLocation))
    .removeUrl('http://www.schema.org/Contains', thingLocation)
    .build()
    existingDataset = setThing(existingDataset, datasetThing);


    const updatedDataset = await saveSolidDatasetAt( // UPDATE DATASET IN POD.
      saveLocation,
      existingDataset,
      { fetch: fetch }
    );

    // RELOAD DATA IN VIEW.
    updateDataset(updatedDataset) // UPDATE DATASET IN STATE.
    const dataobj = preprocessDataset(updatedDataset) // RETRIEVE DATA FROM DATASET.
    updateDataObject(dataobj) //UPDATE RETRIEVED DATA IN STATE.

  }





  async function validateDataset(savelocation) {

    var retrievedData = [];
    var shouldContinue = false;
    var originalDataset;
    var correctDataset;
    

    await solidGet(savelocation).then( async (resx) => {

    originalDataset = resx

    const thing = getThingAll(originalDataset); // GET ALL THINGS FROM DATASET.

    thing.forEach(item => { // ITERATE ALL THINGS.
      
      const checkTypeBookmark = getUrl(item, thingType);

      // HANDLE IF OLD DATASET..:
      if ( checkTypeBookmark === "http://schema.org/Thing") {
        
        shouldContinue = true;

        let bookmarkItem = {
          itemId: getStringNoLocale(item, thingUrl),
          itemTitle: getStringNoLocale(item, thingTitle),
          itemDescription: getStringNoLocale(item, thingDescription),
          itemUrl: getStringNoLocale(item, thingUrl),
          itemCreated: getStringNoLocale(item, thingCreated) || '',
          itemModified: getStringNoLocale(item, thingModified) || ''
        };


        // GET TAGS:
        var listOfTags = [];

        const allTagSubjects = getStringNoLocale(item, thingTags).split(',');

        allTagSubjects.forEach((word)=> {

          var formatedTag = (word[0].toUpperCase() + word.slice(1)).split(" ").join('-')

          const tagItem = {
            word: formatedTag,
            meaning: 'wordnet',
          }

          listOfTags.push(tagItem)

        })

        bookmarkItem.itemTags = listOfTags;

        retrievedData.push(bookmarkItem);              
      }

    });
    
  


    if (shouldContinue) {

      var newDataset = await setupDataset(savelocation); // CREATE DATA TO POD.

        retrievedData.forEach((item) => {

          // ADD BOOKMARK TO DATASET.
          var bookmarkItem = {
            itemId: item.itemId,
            itemType: thingTypeBookmark,
            itemCreated: new Date().toLocaleString('en-US'),
            itemTitle: item.itemTitle,
            itemDescription: item.itemDescription,
            itemUrl: item.itemUrl,
            itemTags: item.itemTags
          };
              

          // Build new thing and add to dataset
          let newThing = buildThing(createThing({ url: savelocation + '#Bookmark/' + bookmarkItem.itemId  }))  
          .addUrl(thingType, bookmarkItem.itemType)   
          .addStringNoLocale(thingCreated, bookmarkItem.itemCreated)
          .addStringNoLocale(thingTitle, bookmarkItem.itemTitle)
          .addStringNoLocale(thingDescription, bookmarkItem.itemDescription)
          .addStringNoLocale(thingUrl, bookmarkItem.itemUrl)
          .build();
          newDataset = setThing(newDataset, newThing);


          // CONNECT BOOKMARK TO DATASET.
          let newThingConnect = getThing(newDataset,  savelocation );
          newThingConnect = buildThing(newThingConnect)
          .addUrl('http://www.schema.org/Contains', savelocation + '#Bookmark/' + bookmarkItem.itemId   )
          .build();
          newDataset = setThing(newDataset, newThingConnect);


          for (let tagCnt = 0; tagCnt < bookmarkItem.itemTags.length; tagCnt++) {

            const tagWord = bookmarkItem.itemTags[tagCnt].word;
            const tagMeaning = bookmarkItem.itemTags[tagCnt].meaning;
            const tagId = 'Tag/' + tagWord

            // ADD TAG TO DATASET.
            const thing_tag = buildThing(createThing({ url: savelocation +'#' + tagId }))        
            .addStringNoLocale(thingWord, tagWord)
            .addStringNoLocale(thingMeaning, tagMeaning)
            .addUrl(thingType, thingTypeTag)
            .build();
            newDataset = setThing(newDataset, thing_tag);

            // CONNECT TAG TO BOOKMARK.
            let thingTagConnect = getThing(newDataset,  savelocation + '#Bookmark/' + bookmarkItem.itemId   );
            thingTagConnect = buildThing(thingTagConnect)
            .addUrl(thingTags, savelocation + '#' + tagId)
            .build();
            newDataset = setThing(newDataset, thingTagConnect);

          }

        })
        
        correctDataset = await saveSolidDatasetAt( // Rebuilt dataset.
          savelocation,
          newDataset,
          { fetch: fetch }
        );

    } else {
      correctDataset = originalDataset // No changes.
    }
  
  }).catch( async ()=> {
    correctDataset = await setupDataset(podUser.podURL); // No existing dataset.

  });

    return correctDataset
  }








  /* ------------------------------ SOLID ACTIONS  --------------------------------------------- */


  async function finishLogin() {

    await handleIncomingRedirect();

    if (session.info.isLoggedIn) {  // CHECK IF USER IS LOGGED IN.

      var podData = podUser;
      podData.webID = session.info.webId;
      podData.podURL = new URL( session.info.webId.split("/profile/card#me")[0] + "/lexitags/bookmarks" ).href;
      podData.isLoggedIn = session.info.isLoggedIn;

      


      const userDataset = await solidGet(session.info.webId)
      const profile = getThing(userDataset, podData.webID);
      const fn = getStringNoLocale(profile, 'http://www.w3.org/2006/vcard/ns#fn');
      podData.userName = fn;
      updatePodUser(podData);


      var data = await validateDataset(podUser.podURL)

    
      updateDataset(data); // UPDATE DATASET IN STATE.
      const dataobj = preprocessDataset(data); // RETRIEVE DATA FROM DATASET.  
      updateDataObject(dataobj) //UPDATE RETRIEVED DATA IN STATE.






      const allBookmarksFromUsers = await getAllUsersBookmarks()
      updateAllUsersBookmarks(allBookmarksFromUsers)

      const topKBookmarks = findTopKBookmarks(allBookmarksFromUsers) // GET POPULAR BOOKMARKS.
      updateTopKBookmarks(topKBookmarks)

      const topKTags = findTopKTags(allBookmarksFromUsers)
      updateTopKTags(topKTags)

      
    }
  }


  // LOAD NEW DATA.
  async function reloadData() {

    const allBookmarksFromUsers = await getAllUsersBookmarks()
    updateAllUsersBookmarks(allBookmarksFromUsers)

    const topKBookmarks = findTopKBookmarks(allBookmarksFromUsers) // GET POPULAR BOOKMARKS.
    updateTopKBookmarks(topKBookmarks)

    const topKTags = findTopKTags(allBookmarksFromUsers)
    updateTopKTags(topKTags)

  }


 





  // RETRIEVE DATA FROM DATASET.
  function preprocessDataset(inputData) {

    var retrievedData = []; // WILL CONTAIN RETRIEVED DATA.

    const existingDataset = inputData; // LOAD DATASET FROM PARAM.
    
    const thing = getThingAll(existingDataset); // GET ALL THINGS FROM DATASET.

    thing.forEach(item => { // ITERATE ALL THINGS.
      
      const checkTypeBookmark = getUrl(item, thingType);

      // HANDLE IF BOOKMARK:
      if ( checkTypeBookmark === thingTypeBookmark) {
        
        let bookmarkItem = {
          itemId: item.url.split("#Bookmark/")[1],
          itemTitle: getStringNoLocale(item, thingTitle),
          itemDescription: getStringNoLocale(item, thingDescription),
          itemUrl: getStringNoLocale(item, thingUrl),
          itemCreated: getStringNoLocale(item, thingCreated) || '',
          itemModified: getStringNoLocale(item, thingModified) || ''
        };


        // GET TAGS:
        var listOfTags = [];

        const allTagSubjects = getUrlAll(item, thingTags);

        allTagSubjects.forEach((tagSubject)=> {

          const tagThing = getThing(existingDataset, tagSubject );

          const tagItem = {
            word: getStringNoLocale(tagThing, thingWord),
            meaning: getStringNoLocale(tagThing, thingMeaning),
          }

        listOfTags.push(tagItem)

        })

        bookmarkItem.itemTags = listOfTags;

        retrievedData.push(bookmarkItem);              
      }

    });
    
    return performSort('DATE', retrievedData);
  }



  /* ---------------------------------- BUTTON HANDLERS - START ------------------------------------ */

  // BUTTON: LOGOUT.
  function logoutUser() {

    // RESET STATES:
    var podUserData = podUser;
    podUserData.webID = "";
    podUserData.podURL = "";
    podUserData.isLoggedIn = false;
    podUserData.userName = '';
    updatePodUser(podUserData);

    updateDataset([]);
    updateDataObject([]);

    setActiveFilter([]);
    setSelectedBookmark({ itemTags: [] });

  }

  // BUTTON: ADD BOOKMARK.
  async function setBookmark() {

    var inputTitle = document.getElementById("input_addbookmark_title").value; // GET TITLE FROM INPUT FIELD.
    var inputDescription = document.getElementById("input_addbookmark_description").value; // GET DESCRIPTION FROM INPUT FIELD.
    var inputUrl = document.getElementById("input_addbookmark_url").value; // GET URL FROM INPUT FIELD.
    
    const bookmarkItem = { // CREATE BOOKMARK OBJECT FROM VALUES.
      itemId: inputUrl,
      itemTitle: inputTitle,
      itemDescription: inputDescription,
      itemUrl: inputUrl,
      itemTags: selectedBookmark.itemTags,
    };


    let alreadyExist = false;
    if ('itemId' in selectedBookmark) {
      alreadyExist = true;
    }

    if (!alreadyExist) {
      await solidCreate(bookmarkItem, podUser.podURL); // CREATE BOOKMARK IN POD.
    } else {
      await solidUpdate(bookmarkItem, podUser.podURL); // UPDATE BOOKMARK IN POD.
    }
    

    reloadData() // FETCH NEW DATA FROM POD.

    setInputWindow(false); // CLOSE ADD-BOOKMARK WINDOW.

    setSelectedBookmark({ itemTags: [] }); // RESET SELECTED BOOKMARK.

  }

  // BUTTON: EDIT BOOKMARK.
  function editBookmark(item) {

    const bookmarkItem = { // CREATE BOOKMARK OBJECT FROM VALUES.
      itemId: item.itemId,
      itemTitle: item.itemTitle,
      itemDescription: item.itemDescription,
      itemUrl: item.itemUrl,
      itemTags: item.itemTags,
    };

    setSelectedBookmark(bookmarkItem); // UPDATE SELECTED BOOKMARK WITH OBJECT.

    setInputWindow(true); // OPEN ADD-BOOKMARK WINDOW.

  }

  // BUTTON: DELETE BOOKMARK.
  async function deleteBookmark(item) {

    await solidDelete(item, podUser.podURL); // DELETE BOOKMARK IN POD.

    reloadData() // FETCH NEW DATA FROM POD.

  }

  // BUTTON: ADD TAG.
  function addTag(event) {

    var newTag = document.getElementById("input_addbookmark_tags").value; // GET TAG FROM INPUT FIELD.

    if (event.key === "Enter" && newTag !== '') { // IF USER CLICKS ENTER.
      event.preventDefault();

      var formatedTag = (newTag[0].toUpperCase() + newTag.slice(1)).split(" ").join('-')

      var updateBookmarkState = { ...selectedBookmark }; // GET SELECTED BOOKMARK.
      
      updateBookmarkState.itemTags.push(   // ADD TAG TO SELECTED BOOKMARK.
        {
          word: formatedTag, 
          meaning: "wordnet"
        }
      );
      
      setSelectedBookmark(updateBookmarkState); // UPDATE SELECTED BOOKMARK IN STATE.

      document.getElementById("input_addbookmark_tags").value = ""; // RESET INPUT FIELD.

    }
  }

  // BUTTON: DELETE TAG.
  function removeTag(item) {

    var updateBookmarkState = { ...selectedBookmark }; // GET SELECTED BOOKMARK.

    updateBookmarkState.itemTags = updateBookmarkState.itemTags.filter( // ITERATE SELECTED BOOKMARK.

      (e) => e.word !== item.word// REMOVE TAG FROM SELECTED BOOKMARK.

    );

    setSelectedBookmark(updateBookmarkState); // UPDATE SELECTED BOOKMARK IN STATE.
  }

  // SEARCHBAR: ENTER.
  function clickSearchbar(event) {

    if (event.key === "Enter") { // IF USER CLICK ENTER.
      event.preventDefault();

      var userInput = document.getElementById("search").value; // GET SEARCH_TERM FROM INPUT FIELD.

      addFilter(userInput); // UPDATE FILTER WITH SEARCH TERM.

      document.getElementById("search").value = ""; // RESET INPUT FIELD.
    }
  }

  // BUTTON: CLICK TAG.
  function clickTag(tagValue) {

    addFilter(tagValue); // UPDATE FILTER WITH TAG VALUE.

  }

  //BUTTON: CLICK TAB.
  function changeTabs(event, newValue) {

    setValue(newValue); // UPDATE SELECTED TAB.

  }

  /* ---------------------------------- SET FILTERS - START ------------------------------------ */

  function addFilter(value) {

    var currentFilter = activeFilter; // STORE ACTIVE FILTER FROM STATE.

    if (!currentFilter.includes(value) && value !== "" && value !== " ") { // CHECK IF CURRENT FILTER INCLUDES SEARCH TERM.

      currentFilter.push(value); // ADD SEARCH TERM TO CURRENT FILTER.

      setActiveFilter(currentFilter); // UPDATE ACTIVE FILTER IN STATE.

      var filteredData = performFilter(); // GET DATA WITH FILTER.

      updateDataObject(filteredData) // UPDATE DATAOBJECT IN STATE.
    }
  }

  function removeFilter(value) {

    var currentFilter = activeFilter; // STORE ACTIVE FILTER FROM STATE.

    if (currentFilter.includes(value)) { // CHECK IF CURRENT FILTER INCLUDES SEARCH TERM.

      var index = currentFilter.indexOf(value); // STORE INDEX OF SEARCH TERM IN CURRENT FILTER.

      currentFilter.splice(index, 1); // REMOVE SEARCH TEXT FROM CURRENT FILTER.

      setActiveFilter(currentFilter); // UPDATE ACTIVE FILTER IN STATE.

      var filteredData = performFilter(); // GET DATA WITH FILTER

      updateDataObject(filteredData) // UPDATE DATAOBJECT IN STATE.

    }
  }





  function performSort(mode, allData) {

    var updatedData = allData;

    if (mode === 'DATE') {

      updatedData.sort((date1, date2) => new Date(date1.itemCreated) - new Date(date2.itemCreated)).reverse();

    } else if (mode === 'ALPHABETICAL') {
      
      updatedData.sort((a, b) => a.itemTitle.localeCompare(b.itemTitle));

    }

    return updatedData // UPDATE DATAOBJECT IN STATE.

  }

  function performFilter() {

    var allData = preprocessDataset(dataset); // RETRIEVE DATA FROM DATASET.
    var filteredData = []; // WILL CONTAIN FILTERED DATA.
    var currentFilter = activeFilter; // CONTAINS ACTIVE FILTER.


    if (currentFilter.length) { // CHECK IF ACTIVE FILTER HAS VALUE.

      allData.forEach((item) => { // ITERATE ALL DATA.

        // STORE AND TRANSFORM VALUES TO LOWERCASE.
        var title = item.itemTitle.toLowerCase(); 
        var url = item.itemUrl.toLowerCase();
        var dateCreated = item.itemCreated.toLowerCase();
        var dateModified = item.itemModified.toLowerCase();
        var tags = item.itemTags; // STORE BOOKMARK TAGS.

        // SEACH FOR VALUES IN BOOKMARK.
        currentFilter.forEach((filter) => { // ITERATE FILTER-TERMS IN ACTIVE FILTER.

          var term = filter.toLowerCase(); // STORE AND TRANSFORM FILTER-TERM TO LOWERCASE.

          if (!filteredData.includes(item) && ( title.includes(term) || url.includes(term) || dateCreated.includes(term) || dateModified.includes(term) ) ) { // CHECK IF FILTERED DATA INCLUDES ITEM AND IF ITEM TITLE INCLUDES FILTER-TERM.

            filteredData.push(item); // ADD ITEM TO FILTERED DATA.

          }

          tags.forEach((tagitem) => { // ITERATE TAGS.

            var tag = tagitem.word.toLowerCase(); // STORE AND TRANSFORM TAG TO LOWERCASE.

            if (!filteredData.includes(item) && tag.includes(term)) { // CHECK IF FILTERED DATA INCLUDES ITEM AND IF TAG INCLUDES FILTER-TERM.

              filteredData.push(item); // ADD ITEM TO FILTERED DATA.

            }
          });
        });
      });
    } else {

      filteredData = allData; // ADD ALL DATA TO FILTERED DATA IF NO ACTIVE FILTER.

    }

    return filteredData // RETURN FILTERED DATA.

  }



/* ---------------------------------- FIND TOP 10 POPULAR ITEMS FROM ALL USERS - START ------------------------------------ */
  
// RETRIEVE ALL USERS BOOKMARKS.
  async function getAllUsersBookmarks() {

    var listOfUsersWebid = await getAllWebIdFromLexitagsPOD() // WILL CONTAIN WEBID'S OF ALL USERS.

    var allBookmarks = [];

    for (let webid of listOfUsersWebid) { // LOOP 1: ITERATE WEBID'S. X

      var podLocation = webid.split("/profile/card#me")[0] + "/lexitags/bookmarks"; // FIND DATASET LOCATION IN POD.

      await solidGet(podLocation)
      .then((response) => { // GET DATASET FROM POD.
        
        
        const allThings = getThingAll(response); // GET THINGS FROM DATASET.

        allThings.forEach(thing => { // LOOP 2: ITERATE DATASET.

          if (getUrl(thing, thingType) === thingTypeBookmark || getUrl(thing, thingType) === 'http://schema.org/Thing') { // CHECK IF THING IS A BOOKMARK!
            
            // GET POPULAR BOOKMARKS OG DENNE ER IDENTIDISKE NED HITTIL:
            const bookmarkTags = getUrlAll(thing, thingTags);

            let bookmarkItem = {
              itemTitle: getStringNoLocale(thing, thingTitle),
              itemDescription: getStringNoLocale(thing, thingDescription),
              itemUrl: getStringNoLocale(thing, thingUrl),
              itemCreated: getStringNoLocale(thing, thingCreated) || '',
              itemModified: getStringNoLocale(thing, thingModified) || ''
            };

            var listOfTags = [];

            bookmarkTags.forEach((tagSubject) => {

                const tagThing = getThing(response, tagSubject);
                const thingTagWord = getStringNoLocale(tagThing, thingWord);
                const thingTagMeaning = getStringNoLocale(tagThing, thingMeaning);


                const tagItem = {
                  word: thingTagWord,
                  meaning: thingTagMeaning,
                }
      
                listOfTags.push(tagItem)
            });
            bookmarkItem.itemTags = listOfTags;
            allBookmarks.push(bookmarkItem);

          };
        });
      }).catch(()=>{console.log('bad link')});
    };

    return allBookmarks
  }

  // RETRIEVE TOPK BOOKMARKS.
  function findTopKBookmarks(allBookmarks) {

    var popularBookmarks = [];

    allBookmarks.forEach((bookmarkItem)=> {
          
      var foundBookmark = false;

      popularBookmarks.forEach((popularItem) => {
      
        if (popularItem.itemUrl === bookmarkItem.itemUrl) { // CHECK IF POPULAR BOOKMARKS CONTAIN BOOKMARK FROM DATASET.

          foundBookmark = true;

          popularItem.timesBookmarked += 1; // ADD +1 TO AMOUNT.
        
          popularItem.itemTags.forEach((tagItem1) => {
          
            bookmarkItem.itemTags.forEach((tagItem2)=> { // loop 5.
              if (tagItem1.word === tagItem2.word && tagItem1.meaning === tagItem2.meaning ) {
                tagItem1.timesTagged += 1;
              }
            }); 
          });
        }
      }); 


      if (!foundBookmark) {
        var tmpL = []

        bookmarkItem.itemTags.forEach((tg)=> {
          var i = tg
          i.timesTagged = 1
          tmpL.push(i)
        })

        const newBookmarkItem = {
          itemUrl: bookmarkItem.itemUrl,
          timesBookmarked: 1,
          itemTags: tmpL.sort((firstItem, secondItem) => secondItem.timesTagged - firstItem.timesTagged).slice(0, 3)
        }

        popularBookmarks.push(newBookmarkItem);
        
      };

    });

    // SORT POPULAR BOOKMARKS BY TOP 10 HIGHEST NUMBER OF BOOKMARKS.
    popularBookmarks = popularBookmarks.sort((firstItem, secondItem) => secondItem.timesBookmarked - firstItem.timesBookmarked).slice(0, 10);

    return popularBookmarks
  }


  // COUNT OCCURENCES OF TAGS.
  function findTopKTags(bookmarks) {

    var topKtagsList = [];

    bookmarks.forEach((item)=> {
      
      item.itemTags.forEach((tagThing)=> {
        
        var foundItem = false;
        var atIndex = 0;

        for (let t = 0; t < topKtagsList.length; t++) { 

          if (tagThing.word === topKtagsList[t].text) {
            foundItem = true;
            atIndex = t;
          } 
        }

        if (foundItem) {
          topKtagsList[atIndex].value += 1
        } else {
          var newTagItem = {
            text: tagThing.word,
            thingMeaning: tagThing.meaning,
            value: 1
          }
          topKtagsList.push(newTagItem)
        }
        })
      
    })

    return topKtagsList
  }
  

  // RETRIEVE BOOKMARKS BY TAG.
  function searchByTag(tagWord, tagMeaning) {

    var newList = [];

    allUsersBookmarks.forEach((item1)=> {

      item1.itemTags.forEach((item2)=> {

        if (tagWord === item2.word) {
          newList.push(item1)
        }
      })
    })

    updateBookmarksByTag(newList)
    
  }

 








  const options = {
    fontSizes: [24, 100]
  };



  














  return (
    
      <SessionProvider sessionId={session.info.sessionId}>

        <header>

            <h2> Lexitags </h2>

            <Tabs 
              id='navigationbar' 
              centered={true} 
              indicatorColor="primary" 
              value={value} 
              onChange={(e, x) => changeTabs(e, x)}
            >
              <Tab label="Your Bookmarks" disabled={!session.info.isLoggedIn} />
              <Tab label="Popular Bookmarks" disabled={!session.info.isLoggedIn} />
              <Tab label="Tag Cloud" disabled={!session.info.isLoggedIn} />
            </Tabs>

            <ProfileMenu 
              loggedin={session.info.isLoggedIn} 
              webid={podUser.webID}
              nameOfUser={podUser.userName}
              value={value}
              logoutFunc={logoutUser} 
              showHelper={() => setHelpWindow(true)} 
              sortMethod1={() => updateDataObject(performSort('DATE', [...dataobject]))} 
              sortMethod2={() => updateDataObject(performSort('ALPHABETICAL', [...dataobject]))} 
            />

        </header>

        <main>
        
        <TabView isLoggedIn={session.info.isLoggedIn} value={value} index={0} >

              <BookmarkActionBar 
                isLoggedIn={session.info.isLoggedIn} 
                tabValue={value} 
                setBookmarkMethod={() => setInputWindow(true)} 
                clickSearchbarMethod={clickSearchbar} 
                activeFilter={activeFilter} 
                removeFilterMethod={removeFilter} 
              />

              {dataobject.map((item) => (

                <BookmarkCardLarge 
                  data={item} 
                  clickTag={clickTag} 
                  editBookmark={editBookmark} 
                  deleteBookmark={deleteBookmark} 
                />

              ))}

        </TabView>

        <TabView isLoggedIn={session.info.isLoggedIn} value={value} index={1} >
              {topKBookmarks.map((popItem) => (
               
               <BookmarkCardMedium 
                  data={popItem} 
                />

              ))}
        </TabView>


        <TabView isLoggedIn={session.info.isLoggedIn} value={value} index={2} >
              
          <div className="tagCloudContainer">

              <ReactWordcloud id='wordcloud'
                callbacks={{ onWordClick: word => searchByTag(word.text, word.thingMeaning) }}
                words={topKTags}
                options={options}
              />

            <div id='bookmarksByTagList'>
              <h2 hidden={bookmarksByTag.length === 0}>Bookmarks</h2>
              {bookmarksByTag.map((bitem) => (
                  <BookmarkCardSmall itemUrl={bitem.itemUrl} />
              ))}

            </div>
          </div>
              
        </TabView>

        </main>

        

        <LoginWindow 
          isLoggedIn={session.info.isLoggedIn} 
        />

        <HelpWindow 
          open={helpWindow} 
          onClose={() => setHelpWindow(false)} 
        />

        <WordnetWindow 
          open={wordnetWindow} 
          onClose={() => setWordnetWindow(false)} 
        />

        <AddBookmarkWindow 
          open={inputWindow} 
          onClose={() => setInputWindow(false) } 
          bookmark={selectedBookmark} 
          setBookmark={setBookmark} 
          setTag={addTag} 
          deleteTag={removeTag} 
          wordnetWindowFunc={() => setWordnetWindow(true)} 
          cancelPost={() => setSelectedBookmark({itemTags: []})} 
        />
      
    </SessionProvider>

  );
}

export default SolidApp;