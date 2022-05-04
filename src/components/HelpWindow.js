import React from "react";
import { Dialog, DialogContent, DialogContentText } from '@material-ui/core';


export function HelpWindow(props) {

    const handleClose = () => {
        props.onClose(props.selectedValue);  // Updating Window State in App.js.
    };

    // With window (unfinished)
    const callBookmarkl = () => {

      // %22${props.lexitagsBookmarklet}%22

      var b = `javascript:(function()%7Bconst%20thingType%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type%22%2CthingCreated%3D%22http%3A%2F%2Fschema.org%2FdateCreated%22%2CthingTitle%3D%22http%3A%2F%2Fschema.org%2FThing%2FalternateName%22%2CthingDescription%3D%22http%3A%2F%2Fschema.org%2FThing%2Fdescription%22%2CthingUrl%3D%22http%3A%2F%2Fschema.org%2FThing%2Furl%22%2CthingTypeThing%3D%22http%3A%2F%2Fschema.org%2FThing%22%3Blet%20webpageDesc%3Ddocument.getElementsByName(%22description%22)%5B0%5D%3BwebpageDesc%3DwebpageDesc%3FwebpageDesc.getAttribute(%22content%22)%3A%22%22%3Bvar%20bookmarkItem%3D%7BitemId%3Awindow.location.href%2CitemTitle%3Adocument.title%2CitemUrl%3Awindow.location.href%2CitemDescription%3AwebpageDesc%2CitemCreated%3A(new%20Date).toISOString()%7D%2CuserInterface%3Ddocument.createElement(%22div%22)%3BuserInterface.id%3D%22lexitagsView%22%2CuserInterface.style.position%3D%22fixed%22%2CuserInterface.style.top%3D%2210%25%22%2CuserInterface.style.left%3D%2230%25%22%2CuserInterface.style.width%3D%22500px%22%2CuserInterface.style.height%3D%22500px%22%2CuserInterface.style.display%3D%22flex%22%2CuserInterface.style.flexDirection%3D%22column%22%2CuserInterface.style.justifyContent%3D%22space-evenly%22%2CuserInterface.style.alignItems%3D%22center%22%2CuserInterface.style.background%3D%22white%22%2CuserInterface.style.borderRadius%3D%2225px%22%2CuserInterface.style.border%3D%22solid%202px%20black%22%3Bvar%20header%3Ddocument.createElement(%22h1%22)%2CheaderText%3Ddocument.createTextNode(%22Add%20Bookmark%22)%3Bheader.appendChild(headerText)%3Bvar%20label1Container%3Ddocument.createElement(%22div%22)%3Blabel1Container.style.display%3D%22flex%22%2Clabel1Container.style.flexDirection%3D%22column%22%3Bvar%20label1%3Ddocument.createElement(%22label%22)%3Blabel1.innerHTML%3D%22Title%3A%20%22%3Bvar%20input1%3Ddocument.createElement(%22input%22)%3Binput1.defaultValue%3DbookmarkItem.itemTitle%2Cinput1.id%3D%22label1%22%2Clabel1Container.appendChild(label1)%2Clabel1Container.appendChild(input1)%3Bvar%20label2Container%3Ddocument.createElement(%22div%22)%3Blabel2Container.style.display%3D%22flex%22%2Clabel2Container.style.flexDirection%3D%22column%22%3Bvar%20label2%3Ddocument.createElement(%22label%22)%3Blabel2.innerHTML%3D%22Description%3A%20%22%3Bvar%20input2%3Ddocument.createElement(%22input%22)%3Binput2.defaultValue%3DbookmarkItem.itemDescription%2Cinput2.id%3D%22label2%22%2Clabel2Container.appendChild(label2)%2Clabel2Container.appendChild(input2)%3Bvar%20label3Container%3Ddocument.createElement(%22div%22)%3Blabel3Container.style.display%3D%22flex%22%2Clabel3Container.style.flexDirection%3D%22column%22%3Bvar%20label3%3Ddocument.createElement(%22label%22)%3Blabel3.innerHTML%3D%22Url%3A%20%22%3Bvar%20input3%3Ddocument.createElement(%22input%22)%3Binput3.defaultValue%3DbookmarkItem.itemUrl%2Cinput3.id%3D%22label1%22%2Clabel3Container.appendChild(label3)%2Clabel3Container.appendChild(input3)%3Bvar%20button2%3Ddocument.createElement(%22button%22)%3Bfunction%20localPostBookmark()%7Bconst%20e%3D%22${props.lexitagsBookmarklet}%22%2Ct%3D%60%3C%24%7Be%7D%23Bookmark%2F%24%7BbookmarkItem.itemUrl%7D%3E%60%3B%5B%60INSERT%20%7B%20%3C%24%7Be%7D%3E%20%3Chttp%3A%2F%2Fwww.schema.org%2FContains%3E%20%24%7Bt%7D%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingType%7D%3E%20%3C%24%7BthingTypeThing%7D%3E%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingCreated%7D%3E%20%22%24%7BbookmarkItem.itemCreated%7D%22%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingTitle%7D%3E%20%22%24%7BbookmarkItem.itemTitle%7D%22%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingDescription%7D%3E%20%22%24%7BbookmarkItem.itemDescription%7D%22%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingUrl%7D%3E%20%22%24%7BbookmarkItem.itemUrl%7D%22%20.%20%7D%60%5D.forEach((t%3D%3E%7Bwindow.fetch(e%2C%7Bmethod%3A%22PATCH%22%2Cheaders%3A%7B%22Content-Type%22%3A%22application%2Fsparql-update%22%7D%2Cbody%3At%7D)%7D))%3Bdocument.getElementById(%22lexitagsView%22).remove()%7Dbutton2.style.width%3D%22200px%22%2Cbutton2.style.height%3D%2250px%22%2Cbutton2.style.background%3D%22%236952bd%22%2Cbutton2.style.color%3D%22black%22%2Cbutton2.style.borderRadius%3D%2225px%22%2Cbutton2.innerHTML%3D%22Save%20to%20Pod%22%2Cbutton2.onclick%3DlocalPostBookmark%2CuserInterface.appendChild(header)%2CuserInterface.appendChild(label1Container)%2CuserInterface.appendChild(label2Container)%2CuserInterface.appendChild(label3Container)%2CuserInterface.appendChild(button2)%2Cdocument.body.appendChild(userInterface)%3B%7D)()%3B`;
      return b

    }

    const callBookmarkl2 = () => {

      // %22${props.lexitagsBookmarklet}%22

      var b = `javascript:(function()%7Bjavascript%3A(function()%7Bconst%20thingType%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type%22%2CthingCreated%3D%22http%3A%2F%2Fschema.org%2FdateCreated%22%2CthingTitle%3D%22http%3A%2F%2Fschema.org%2FThing%2FalternateName%22%2CthingDescription%3D%22http%3A%2F%2Fschema.org%2FThing%2Fdescription%22%2CthingUrl%3D%22http%3A%2F%2Fschema.org%2FThing%2Furl%22%2CthingTypeThing%3D%22http%3A%2F%2Fschema.org%2FThing%22%3Blet%20webpageDesc%3Ddocument.getElementsByName(%22description%22)%5B0%5D%3BwebpageDesc%3DwebpageDesc%3FwebpageDesc.getAttribute(%22content%22)%3A%22%22%3Bvar%20bookmarkItem%3D%7BitemId%3Awindow.location.href%2CitemTitle%3Adocument.title%2CitemUrl%3Awindow.location.href%2CitemDescription%3AwebpageDesc%2CitemCreated%3A(new%20Date).toISOString()%7D%3Bconst%20e%3D%22${props.lexitagsBookmarklet}%22%2Ct%3D%60%3C%24%7Be%7D%23Bookmark%2F%24%7BbookmarkItem.itemUrl%7D%3E%60%3B%5B%60INSERT%20%7B%20%3C%24%7Be%7D%3E%20%3Chttp%3A%2F%2Fwww.schema.org%2FContains%3E%3B%20%24%7Bt%7D%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingType%7D%3E%20%3C%24%7BthingTypeThing%7D%3E%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingCreated%7D%3E%20%22%24%7BbookmarkItem.itemCreated%7D%22%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingTitle%7D%3E%20%22%24%7BbookmarkItem.itemTitle%7D%22%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingDescription%7D%3E%20%22%24%7BbookmarkItem.itemDescription%7D%22%20.%20%7D%60%2C%60INSERT%20%7B%20%24%7Bt%7D%20%3C%24%7BthingUrl%7D%3E%20%22%24%7BbookmarkItem.itemUrl%7D%22%20.%20%7D%60%5D.forEach((t%3D%3E%7Bwindow.fetch(e%2C%7Bmethod%3A%22PATCH%22%2Cheaders%3A%7B%22Content-Type%22%3A%22application%2Fsparql-update%22%7D%2Cbody%3At%7D)%7D))%3B%7D)()%3B%7D)()%3B`;
      return b

    }

    return (

        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
            
        <DialogContent>
          
          <DialogContentText> Bookmarklet: Drag one of the following links to your bookmarks toolbar: </DialogContentText>
            <a href={callBookmarkl2()}>
              LexiTags Bookmarklet (No Window)
            </a>
        </DialogContent>

      </Dialog>

    )
}