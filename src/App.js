import React, { useState, useEffect } from "react";

import {
  Tab,
  Tabs
} from "@material-ui/core";


import ReactWordcloud from 'react-wordcloud';

import axios from "axios";

import {
  fetch,
  getDefaultSession,
  handleIncomingRedirect,
  logout
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

  const thingType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
  const thingCreated = 'http://schema.org/dateCreated';
  const thingModified = 'http://schema.org/dateModified';
  const thingTitle = 'http://schema.org/Thing/alternateName';
  const thingDescription = 'http://schema.org/Thing/description';
  const thingUrl = 'http://schema.org/Thing/url';
  const thingTags = 'http://schema.org/Thing/disambiguationDescription';
  const thingWord = 'http://schema.org/Thing/Word';
  const thingMeaning = 'http://schema.org/Thing/Meaning';
  const thingTypeThing = 'http://schema.org/Thing';
  const thingTypeDataset = 'http://schema.org/Dataset';
  const thingTypeBookmark = 'http://schema.org/Bookmark';
  const thingTypeTag = 'http://schema.org/Tag';



  // UI
  const [value, updateTab] = useState(0);
  const [inputWindow, setInputWindow] = useState(false);
  const [helpWindow, setHelpWindow] = useState(false);
  const [wordnetWindow, setWordnetWindow] = useState(false);

  const wordcloudOptions = { fontSizes: [24, 100] };





  // DATA STATE CONTROLLERS + METHODS
  const [dataset, updateDataset] = useState([]);
  const [dataobject, updateDataObject] = useState([]);
  const [optOutState, updateoptOutState] = useState(true);
  const [allUsersBookmarks, updateAllUsersBookmarks] = useState([]);
  const [topKBookmarks, updateTopKBookmarks] = useState([]);
  const [topKTags, updateTopKTags] = useState([]);
  const [bookmarksByTag, updateBookmarksByTag] = useState([]);
  const [activeFilter, setActiveFilter] = useState([]);
  const [selectedBookmark, setSelectedBookmark] = useState({ itemTags: [] });
  const [podUser, updatePodUser] = useState({
    webID: getDefaultSession().info.webId,
    podURL: '',
    isLoggedIn: getDefaultSession().info.isLoggedIn,
    userName: ''
  });

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

  function performFilter() {

    var allData = transformSolidDatasetToJSObject(dataset); // RETRIEVE DATA FROM DATASET.
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

  function performSort(mode, allData) {

    var updatedData = allData;

    if (mode === 'DATE') {

      updatedData.sort((date1, date2) => new Date(date1.itemCreated) - new Date(date2.itemCreated)).reverse();

    } else if (mode === 'ALPHABETICAL') {
      
      updatedData.sort((a, b) => a.itemTitle.localeCompare(b.itemTitle));

    }

    return updatedData // UPDATE DATAOBJECT IN STATE.

  }
  
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

  function clickTag(tagValue) {

    addFilter(tagValue); // UPDATE FILTER WITH TAG VALUE.

  }

  function clickSearchbar(event) {

    if (event.key === "Enter") { // IF USER CLICK ENTER.
      event.preventDefault();

      var userInput = document.getElementById("search").value; // GET SEARCH_TERM FROM INPUT FIELD.

      addFilter(userInput); // UPDATE FILTER WITH SEARCH TERM.

      document.getElementById("search").value = ""; // RESET INPUT FIELD.
    }
  }

  function updatePersonalData(existingDataset) {

    updateDataset(existingDataset) // UPDATE DATASET IN STATE.
    const dataobj = transformSolidDatasetToJSObject(existingDataset) // RETRIEVE DATA FROM DATASET.
    updateDataObject(dataobj) //UPDATE RETRIEVED DATA IN STATE.

  }

  function updatePublicData(allBookmarksFromUsers) {

      updateBookmarksByTag([])

      updateAllUsersBookmarks(allBookmarksFromUsers)

      const topKBookmarks = findTopKBookmarks(allBookmarksFromUsers) // Find TopK Bookmarks.
      const topKTags = findTopKTags(allBookmarksFromUsers) // Find TopK Tags.

      updateTopKBookmarks(topKBookmarks)
      updateTopKTags(topKTags)
      
  }

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

  function removeTag(item) {

    var updateBookmarkState = { ...selectedBookmark }; // GET SELECTED BOOKMARK.

    updateBookmarkState.itemTags = updateBookmarkState.itemTags.filter( // ITERATE SELECTED BOOKMARK.

      (e) => e.word !== item.word// REMOVE TAG FROM SELECTED BOOKMARK.

    );

    setSelectedBookmark(updateBookmarkState); // UPDATE SELECTED BOOKMARK IN STATE.
  }

  function setBookmark() {

    const inputTitle = document.getElementById("input_addbookmark_title").value;
    const inputDescription = document.getElementById("input_addbookmark_description").value;
    const inputUrl = document.getElementById("input_addbookmark_url").value;
    
    const bookmarkItem = { // CREATE BOOKMARK OBJECT FROM VALUES.
      itemId: inputUrl,
      itemTitle: inputTitle,
      itemDescription: inputDescription,
      itemUrl: inputUrl,
      itemTags: selectedBookmark.itemTags,
    };

    setInputWindow(false); // CLOSE ADD-BOOKMARK WINDOW.

    setSelectedBookmark({ itemTags: [] }); // RESET SELECTED BOOKMARK.

    return bookmarkItem

  }

  function resetAllStates() {

    var podUserData = podUser;
    podUserData.webID = getDefaultSession().info.webId;
    podUserData.podURL = '';
    podUserData.isLoggedIn = getDefaultSession().info.isLoggedIn;
    podUserData.userName = '';
    updatePodUser(podUserData);

    updateDataset([]);
    updateDataObject([]);

    updateoptOutState(true)
    updateAllUsersBookmarks([])
    updateTopKBookmarks([])
    updateTopKTags([])
    updateBookmarksByTag([])
    

    setActiveFilter([]);
    setSelectedBookmark({ itemTags: [] });
  }






  // SOLID DATA BUILDERS

  function solidCreateDataset(saveLocation) {

    let newDataset = createSolidDataset(); 
    
    const newThing = buildThing(createThing({ url: saveLocation }))
    .addUrl(thingType, thingTypeDataset)
    .build();     

    newDataset = setThing(newDataset, newThing);

    return newDataset;
  }

  function solidCreateItem(item, saveLocation) {

    var existingDataset = dataset; // LOAD EXISTING DATASET FROM STATE.

    // ADD BOOKMARK TO DATASET.
    var bookmarkItem = {
      itemId: item.itemId,
      itemType: thingTypeThing,
      itemCreated: new Date().toISOString(),
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

    return existingDataset
  }

  function solidUpdateItem(item, saveLocation) {

    var existingDataset = dataset; // LOAD EXISTING DATASET FROM STATE.

    // ADD BOOKMARK TO DATASET.
    var bookmarkItem = {
      itemId: item.itemId,
      itemModified: new Date().toISOString(),
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

  return existingDataset
  }
  
  function solidDeleteItem(item, saveLocation) {

    var existingDataset = dataset;  // LOAD EXISTING DATASET FROM STATE.

    // Deletes thing.
    const thingLocation = saveLocation + '#Bookmark/' + item.itemId; // CREATE PATH TO THING IN DATASET.
    const existingThing = getThing(existingDataset, thingLocation); // GET THING FROM DATASET.
    existingDataset = removeThing(existingDataset, existingThing); // REMOVE THING FROM DATASET.

    // Removes Connection to Dataset.
    const datasetThing = buildThing(getThing(existingDataset, saveLocation))
    .removeUrl('http://www.schema.org/Contains', thingLocation)
    .build()
    existingDataset = setThing(existingDataset, datasetThing);

    return existingDataset
  }

  function transformSolidDatasetToJSObject(inputData) {

    var retrievedData = []; // WILL CONTAIN RETRIEVED DATA.

    const existingDataset = inputData; // LOAD DATASET FROM PARAM.
    
    const thing = getThingAll(existingDataset); // GET ALL THINGS FROM DATASET.

    thing.forEach(item => { // ITERATE ALL THINGS.
      
      const checkTypeBookmark = getUrl(item, thingType);

      // HANDLE IF BOOKMARK:
      if ( checkTypeBookmark === 'http://schema.org/Thing') {
        
        let bookmarkItem = {
          itemId: item.url.split("#Bookmark/")[1],
          itemTitle: getStringNoLocale(item, thingTitle),
          itemDescription: getStringNoLocale(item, thingDescription),
          itemUrl: getStringNoLocale(item, thingUrl),
          itemCreated: new Date(getStringNoLocale(item, thingCreated) || '').toLocaleString('en-US'),
          itemModified: new Date(getStringNoLocale(item, thingModified) || '').toLocaleString('en-US'),
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


  // SOLID POD BACKEND

  async function solidUpdateDatasetPermissions() {

    access.getAccessForAll( podUser.podURL, "agent", {fetch: fetch} ) // GET ACCESS FOR DATASET.
    .then(response => console.log('trenger jeg denne ?', response))
    .catch(async () => {  // CATCH ERROR -> 404 NOT FOUND -> NO ACL -> CREATE, SET, SAVE.

      const myDatasetWithAcl = await getSolidDatasetWithAcl(podUser.podURL, {fetch: fetch});
      const datasetWithAcl = createAclFromFallbackAcl(myDatasetWithAcl)
      await saveAclFor(myDatasetWithAcl, datasetWithAcl, {fetch: fetch});
    
    })
    .finally(() => {  // SET PUBLIC ACCESS ON DATASET.

      access.setPublicAccess( podUser.podURL, { read: true, append: false, write: false, controlRead: false, controlWrite: false }, { fetch: fetch } );

    })


  }

  async function solidGetDataFromAllUsers() {

    var listOfUsersWebid = await getAllWebIdFromLexitagsPOD() // WILL CONTAIN WEBID'S OF ALL USERS.
  
    // CHECK IF ACTIVE USER HAS OPTED OUT - UPDATE UX STATE.
    if (listOfUsersWebid.includes(podUser.webID)) {
      updateoptOutState(true)
    } else {
      updateoptOutState(false)
    }

    var allBookmarks = [];

    for (let webid of listOfUsersWebid) { // LOOP 1: ITERATE WEBID'S. X

      var podLocation = webid.split("/profile/card#me")[0] + "/lexitags/bookmarks"; // FIND DATASET LOCATION IN POD.

      await getSolidDataset(podLocation, { fetch: fetch })
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

  async function solidFindDataset(saveLocation) {

    var existingDataset;
    
    await getSolidDataset(saveLocation, { fetch: fetch })
    .then((response) => {
      
      existingDataset = response;

    }).catch( async () => {

      const newDataset = await solidCreateDataset(saveLocation); // Create a new dataset.

      existingDataset = await saveSolidDatasetAt( saveLocation, newDataset, { fetch: fetch } ); // Save to Pod.
      
      await solidUpdateDatasetPermissions(); // Update permissions.

      saveWebIdToLexitagsPOD(); // Store users webid for public data access.

    });

    return existingDataset
  }

  async function saveWebIdToLexitagsPOD() {
    
    const lexitagsPODURL = "https://lexitagspod.inrupt.net/appusers/datafile"; // LOCATION OF FILE IN APPLICATION POD.

    var existingDataset = await getSolidDataset(lexitagsPODURL); // GET DATASET FROM APPLICATION POD.
    
    const newThing = buildThing(createThing({ name: `${podUser.webID}` })) // CREATE THING.
      .addUrl(thingType, thingTypeDataset)
      .build();

    existingDataset = setThing(existingDataset, newThing); // ADD OR UPDATE DATASET WITH THING.

    await saveSolidDatasetAt( lexitagsPODURL, existingDataset );  

  }

  async function removeWebIdFromLexitagsPOD() {
    
    const lexitagsPODURL = "https://lexitagspod.inrupt.net/appusers/datafile"; // LOCATION OF FILE IN APPLICATION POD.

    const usersPODURL = lexitagsPODURL + '#' + podUser.webID;
    
    var existingDataset = await getSolidDataset(lexitagsPODURL); // GET DATASET FROM APPLICATION POD.
    
    const existingThing = getThing(existingDataset, usersPODURL); // GET THING FROM DATASET.

    existingDataset = removeThing(existingDataset, existingThing); // REMOVE THING FROM DATASET.

    await saveSolidDatasetAt( lexitagsPODURL, existingDataset );  

  }

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

  async function afterLogin() {

    if (getDefaultSession().info.isLoggedIn) {

      // FIND DATA ABOUT USER
      var podData = podUser;
      podData.webID = getDefaultSession().info.webId;
      podData.podURL = new URL( getDefaultSession().info.webId.split("/profile/card#me")[0] + "/lexitags/bookmarks" ).href;
      podData.isLoggedIn = getDefaultSession().info.isLoggedIn;

      const userDataset = await getSolidDataset(podData.webID, { fetch: fetch })
      const profile = getThing(userDataset, podData.webID);
      podData.userName = getStringNoLocale(profile, 'http://www.w3.org/2006/vcard/ns#fn');
      updatePodUser(podData);

      // FETCH USERS BOOKMARKS
      await solidFindDataset(podUser.podURL).then((data) => {
        updatePersonalData(data)
      });

      // FETCH PUBLIC BOOKMARKS
      await solidGetDataFromAllUsers().then((data) => {
        updatePublicData(data);
      });
    
    }
  }

  async function updateBookmark() {

    const item = setBookmark()

    let existingDataset = dataset;
    const existingThing = getThing(existingDataset, podUser.podURL + '#Bookmark/' + item.itemId);

    if (existingThing) {
      existingDataset =  solidUpdateItem(item, podUser.podURL);
    } else {
      existingDataset = solidCreateItem(item, podUser.podURL);
    }

    // SAVE DATASET AND FETCH NEW VERSION.
    await saveSolidDatasetAt( podUser.podURL, existingDataset, { fetch: fetch } ).then((data) => {
      updatePersonalData(data)
    })
    
    // FETCH NEW VERSION OF PUBLIC DATA.
    await solidGetDataFromAllUsers().then((data) => {
      updatePublicData(data);
    });
  }

  async function deleteBookmark(item) {

    const newDataset = solidDeleteItem(item, podUser.podURL); // DELETE BOOKMARK IN POD.
    
    await saveSolidDatasetAt( podUser.podURL, newDataset, { fetch: fetch } ).then((data) => {
      updatePersonalData(data)
    });

    await solidGetDataFromAllUsers().then((data) => {
      updatePublicData(data);
    });

  }

  function logoutUser() {

    logout().then(() => {
      resetAllStates();
    }) 

  }

  function updatePublicDataPermissions(newValue) {

    new Promise( async (resolve, reject) => {

      if (newValue) {
        await saveWebIdToLexitagsPOD()
      } else {
        await removeWebIdFromLexitagsPOD()
      }
      resolve('Success!');
    }).then( async () => {      
      await solidGetDataFromAllUsers().then((data) => {
        updatePublicData(data);
      });
    })

  }




/*/ BENCHMARKS
axios.defaults.timeout = 0;
// B E N C H M A R K  -- T E S T I N G -- S E C T I O N
const [podBench, setNumberOfPods] = useState(1);
const [datasetBench, setDatasetTitle] = useState('dataset1');


async function benchmarkSolidAll() {

  // SETUP
  const response = await fetchFromSolidPod(podBench, datasetBench);

  // EXPERIMENT
  const t0 = performance.now();
            
    const results = processSolidPod(response);

    console.log(results);

  const t1 = performance.now();

  console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
}

async function benchmarkSolidTopK() {

  // SETUP
  const response = await fetchFromSolidPod(podBench, datasetBench);

  // EXPERIMENT
  const t0 = performance.now();
        
    const results = processSolidPod(response);

    const resultsAgg = findTopKItemsSolidPod(results);

    console.log(resultsAgg);

  const t1 = performance.now();

  console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
}

async function benchmarkTriplestoreAll() {

  // SETUP
  const response = await fetchAllFromTriplestore(podBench, datasetBench);

  // EXPERIMENT
  const t0 = performance.now();
        
    const results = processTriplestore(response);
    
    console.log(results);

  const t1 = performance.now();

  console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
}

async function benchmarkTriplestoreTopK() {

    // SETUP
    const response = await fetchTopKFromTriplestore(podBench, datasetBench, 10);


    // EXPERIMENT
    const t0 = performance.now();
          
      const results = processTopKItemsTriplestore(response);
      
      console.log(results);

    const t1 = performance.now();

    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
}

async function fetchAllFromTriplestore(numberOfPods, dataset) {

  const specificUsername = 'user0';
    
  const query = `
    PREFIX type: <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>
    PREFIX container: <http://www.w3.org/ns/ldp#Container>
    PREFIX contains: <http://www.w3.org/ns/ldp#contains>
    PREFIX containsI: <http://www.schema.org/Contains>
    PREFIX person: <http://schema.org/Person>
    
    SELECT ?subject ?predicate ?object
      WHERE {
        
        {
            SELECT *
            WHERE {?webid type: person: . # GET ALL WEBIDS.
            #FILTER regex(STR(?webid), ${specificUsername}) # CAN BE USED TO SELECT SPECIFIC USERS.
            } LIMIT ${numberOfPods}
        }
          
        #FIND DATASET LOCATION:
        BIND (URI(REPLACE(STR(?webid), "/profile/card#me", "", "i")) AS ?podBase) # GET POD URL.
        BIND (URI(CONCAT(STR(?podBase), "/public/${dataset}")) AS ?dataset) # GET DATASET URL.
        
        #RETRIEVE ALL SUBJECT, PREDICATE, OBJECT FROM DATASET:
        ?dataset containsI: ?subject .
        ?subject ?predicate ?object .
        
      }`;

  const response = await axios.post('http://localhost:3001/api/get', {query: query} );
  
  return response

}

async function fetchTopKFromTriplestore(numberOfPods, dataset, topKItems) {

  const specificUsername = 'user0';
    
  const queryTopK = `
    PREFIX type: <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>
    PREFIX container: <http://www.w3.org/ns/ldp#Container>
    PREFIX contains: <http://www.w3.org/ns/ldp#contains>
    PREFIX containsI: <http://www.schema.org/Contains>
    PREFIX person: <http://schema.org/Person>
    PREFIX url: <http://schema.org/Thing/url>

    SELECT ?object ?objectCount
      WHERE {
            
        { 
          SELECT ?object (count(?object) as?objectCount) 
          WHERE {
              
              # SELECT AND FILTER WEBID'S:
            { 
                SELECT *
                WHERE {
                    ?webid type: person: . # GET ALL WEBIDS.
                    #FILTER regex(STR(?webid), ${specificUsername}) # CAN BE USED TO SELECT SPECIFIC USERS.
                } LIMIT ${numberOfPods}
            }
          
              #FIND DATASET LOCATION:
              BIND (URI(REPLACE(STR(?webid), "/profile/card#me", "", "i")) AS ?podBase) # GET POD URL.
              BIND (URI(CONCAT(STR(?podBase), "/public/${dataset}")) AS ?dataset) # GET DATASET URL.

              #RETRIEVE ALL SUBJECT, PREDICATE, OBJECT FROM DATASET:
              ?dataset containsI: ?subject . # Lists all Items. 
              ?subject url: ?object .
          
          } GROUP BY ?object
          
        }
        
      }
    GROUP BY ?bookmark ?object ?objectCount
    ORDER BY DESC(?objectCount) 
    LIMIT ${topKItems}`;


  const response = await axios.post('http://localhost:3001/api/get', {query: queryTopK} );
  
  return response

}

async function fetchFromSolidPod(numberOfPods, dataset) {

  let output = [];

  for (let index = 0; index < numberOfPods; index++) {

    const url = `https://user${index}.localhost:8443/public/${dataset}`;

    const response = await getSolidDataset(url);
    
    output.push(response);
    
  }

  return output

}

function processSolidPod(input) {

  var output = [];

  input.forEach((dataset) => {

    // Extract data from each response:
    getThingAll(dataset).forEach(item => {

      const checkTypeBookmark = getUrl(item, thingType);

      if ( checkTypeBookmark === 'http://schema.org/Bookmark') {

        const newItem = {
          itemId: item.url,//.split("#Bookmark/")[1],  // Fjern splitt for å få unike items fra hver bruker..
          itemTitle: getStringNoLocale(item, thingTitle),
          itemDescription: getStringNoLocale(item, thingDescription),
          itemUrl: getStringNoLocale(item, thingUrl),
          itemCreated: new Date(getStringNoLocale(item, thingCreated) || '').toLocaleString('en-US'),
          itemModified: new Date(getStringNoLocale(item, thingModified) || '').toLocaleString('en-US'),
        };

        output.push(newItem);              
      }

    });
  })
  
  return output
  
}

function processTriplestore(input) {

  var output = [];

  // Extract data from response:
  input.data.forEach(item => {

    if (item.subject) {
      
    const itemID = item.subject.value//.split('#Bookmark/')[1]; // Fjern splitt for å få unike items fra hver bruker..

    // Check if ouput already contains itemID:
    if (!output.some(e => e.itemId === itemID)) {

      output.push({itemId: itemID})

    }

    const index = output.findIndex( ({ itemId }) => itemId === itemID );

    switch (item.predicate.value) {
      case thingTitle:
        output[index].itemTitle = item.object.value;
        break;
      case thingDescription:
        output[index].itemDescription = item.object.value;
        break;
      case thingUrl:
        output[index].itemUrl = item.object.value;
        break;
      case thingCreated:
        output[index].itemCreated = item.object.value;
        break;
      case thingModified:    
        output[index].itemModified = item.object.value;
        break;
      default:
        break;
    }
  }
  })

  return output

}

function processTopKItemsTriplestore(input) {

  var output = [];

  // Extract data from response:
  input.data.forEach(item => {

    if (item.object) {

      const a = {
        url: item.object.value,
        count: item.objectCount.value
      }
      output.push(a)

    }
  })

  return output

}

function findTopKItemsSolidPod(allBookmarks) {

  var popularBookmarks = [];

  allBookmarks.forEach((bookmarkItem)=> {
        
    var foundBookmark = false;

    popularBookmarks.forEach((popularItem) => {
    
      if (popularItem.itemUrl === bookmarkItem.itemUrl) { // CHECK IF POPULAR BOOKMARKS CONTAIN BOOKMARK FROM DATASET.

        foundBookmark = true;

        popularItem.timesBookmarked += 1; // ADD +1 TO AMOUNT.
      
      }
    }); 

    if (!foundBookmark) {

      const newBookmarkItem = {
        itemUrl: bookmarkItem.itemUrl,
        timesBookmarked: 1
      }

      popularBookmarks.push(newBookmarkItem);
      
    };

  });

  // SORT POPULAR BOOKMARKS BY TOP 10 HIGHEST NUMBER OF BOOKMARKS.
  popularBookmarks = popularBookmarks.sort((firstItem, secondItem) => secondItem.timesBookmarked - firstItem.timesBookmarked).slice(0, 10);

  return popularBookmarks

}

*/




useEffect(() => {

  handleIncomingRedirect({

    restorePreviousSession: true,

    onError: (error, errorDescription) => {
      console.log(`${error} has occured: `, errorDescription);
    }
  
  }).then(async() => { await afterLogin() });
  
}, [getDefaultSession().info.webId]); 



  
  return (

      <div id='application'>

{/*
       <div id='benchmark-section'>
          <input type="text" name="input-subject1" id="input-subject1" onChange={(e) => { setNumberOfPods(e.target.value) }} ></input>
          <input type="text" name="input-subject2" id="input-subject2" onChange={(e) => { setDatasetTitle(e.target.value) }} ></input>
          <button onClick={() => console.log('number of Pods  = ', podBench, ' dataset = ', datasetBench) }>Check </button>
          
          <button onClick={() => benchmarkSolidAll() }>Benchmark: Solid All</button>
          <button onClick={() => benchmarkSolidTopK() }>Benchmark: Solid TopK</button>
          <button onClick={() => benchmarkTriplestoreAll() }>Benchmark: Triplestore All</button>
          <button onClick={() => benchmarkTriplestoreTopK() }>Benchmark: Triplestore TopK</button>
        </div>
*/}
        <header>

            <h2> Lexitags </h2>

            <Tabs 
              id='navigationbar' 
              centered={true} 
              indicatorColor="primary" 
              value={value} 
              onChange={(e, x) => updateTab(x)}
            >
              <Tab label="Your Bookmarks" disabled={!getDefaultSession().info.isLoggedIn} />
              <Tab label="Popular Bookmarks" disabled={!getDefaultSession().info.isLoggedIn} />
              <Tab label="Tag Cloud" disabled={!getDefaultSession().info.isLoggedIn} />
            </Tabs>

            <ProfileMenu 
              loggedin={getDefaultSession().info.isLoggedIn} 
              webid={podUser.webID}
              nameOfUser={podUser.userName}
              value={value}
              logoutMethod={logoutUser} 
              optOutState ={optOutState}
              showHelper={() => setHelpWindow(true)} 
              sortMethod1={() => updateDataObject(performSort('DATE', [...dataobject]))} 
              sortMethod2={() => updateDataObject(performSort('ALPHABETICAL', [...dataobject]))} 
              optOutMethod={updatePublicDataPermissions}
              
            />


        </header>

        <main>
        
        <TabView isLoggedIn={getDefaultSession().info.isLoggedIn} value={value} index={0} >

              <BookmarkActionBar 
                isLoggedIn={getDefaultSession().info.isLoggedIn} 
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

        <TabView isLoggedIn={getDefaultSession().info.isLoggedIn} value={value} index={1} >
              {topKBookmarks.map((popItem) => (
               
               <BookmarkCardMedium 
                  data={popItem} 
                />

              ))}
        </TabView>


        <TabView isLoggedIn={getDefaultSession().info.isLoggedIn} value={value} index={2} >
              
          <div className="tagCloudContainer">

              <ReactWordcloud id='wordcloud'
                callbacks={{ onWordClick: word => searchByTag(word.text, word.thingMeaning) }}
                words={topKTags}
                options={wordcloudOptions}
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
          isLoggedIn={getDefaultSession().info.isLoggedIn} 
        />

        <HelpWindow 
          open={helpWindow} 
          onClose={() => setHelpWindow(false)} 
          lexitagsBookmarklet={podUser.podURL}
        />

        <WordnetWindow 
          open={wordnetWindow} 
          onClose={() => setWordnetWindow(false)} 
        />

        <AddBookmarkWindow 
          open={inputWindow} 
          onClose={() => setInputWindow(false) } 
          bookmark={selectedBookmark} 
          setBookmark={updateBookmark} 
          setTag={addTag} 
          deleteTag={removeTag} 
          wordnetWindowFunc={() => setWordnetWindow(true)} 
          cancelPost={() => setSelectedBookmark({itemTags: []})} 
        />
      
    </div>

  );
}

export default SolidApp;