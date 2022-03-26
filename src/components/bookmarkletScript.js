
function bookmarkletCode() {

    // PREFIX
    const thingType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

    const thingCreated = 'http://schema.org/dateCreated';

    const thingTitle = 'http://schema.org/Thing/alternateName';
    const thingDescription = 'http://schema.org/Thing/description';
    const thingUrl = 'http://schema.org/Thing/url';

    const thingTypeThing = 'http://schema.org/Thing';




    let webpageDesc = document.getElementsByName('description')[0];
    if (webpageDesc) {
        webpageDesc = webpageDesc.getAttribute('content');
    } else {
        webpageDesc = '';
    };


    var bookmarkItem = {
        itemId: window.location.href,
        itemTitle: document.title,
        itemUrl: window.location.href,
        itemDescription: webpageDesc,
        itemCreated: new Date().toISOString()
    };






    var userInterface = document.createElement('div');
    userInterface.id = 'lexitagsView'
    userInterface.style.position = 'fixed';
    userInterface.style.top = '10%';
    userInterface.style.left = '30%';
    userInterface.style.width = '500px';
    userInterface.style.height = '500px';
    userInterface.style.display = 'flex';
    userInterface.style.flexDirection = 'column';
    userInterface.style.justifyContent = 'space-evenly';
    userInterface.style.alignItems = 'center';
    userInterface.style.background = 'white';
    userInterface.style.borderRadius = '25px';
    userInterface.style.border = 'solid 2px black';


    var header = document.createElement('h1');
    var headerText = document.createTextNode('Add Bookmark');
    header.appendChild(headerText);



    var label1Container = document.createElement('div');
    label1Container.style.display = 'flex';
    label1Container.style.flexDirection = 'column';

    var label1 = document.createElement('label');
    label1.innerHTML = 'Title: ';

    var input1 = document.createElement('input');
    input1.defaultValue = bookmarkItem.itemTitle;
    input1.id = 'label1';

    label1Container.appendChild(label1);
    label1Container.appendChild(input1);


    var label2Container = document.createElement('div');
    label2Container.style.display = 'flex';
    label2Container.style.flexDirection = 'column';

    var label2 = document.createElement('label');
    label2.innerHTML = 'Description: ';

    var input2 = document.createElement('input');
    input2.defaultValue = bookmarkItem.itemDescription;
    input2.id = 'label2';

    label2Container.appendChild(label2);
    label2Container.appendChild(input2);


    var label3Container = document.createElement('div');
    label3Container.style.display = 'flex';
    label3Container.style.flexDirection = 'column';

    var label3 = document.createElement('label');
    label3.innerHTML = 'Url: ';

    var input3 = document.createElement('input');
    input3.defaultValue = bookmarkItem.itemUrl;
    input3.id = 'label1';

    label3Container.appendChild(label3);
    label3Container.appendChild(input3);



    var button2 = document.createElement('button');
    button2.style.width = '200px';
    button2.style.height = '50px';
    button2.style.background = '#6952bd';
    button2.style.color = 'black';
    button2.style.borderRadius = '25px';
    button2.innerHTML = 'Save to Pod';
    button2.onclick = localPostBookmark;


    userInterface.appendChild(header);
    userInterface.appendChild(label1Container);
    userInterface.appendChild(label2Container);
    userInterface.appendChild(label3Container);
    userInterface.appendChild(button2);

    document.body.appendChild(userInterface);



    // button actions
    function localPostBookmark() {

        const datasetLocation = 'https://martinclone.inrupt.net/lexitags/bookmarks';

        const itemSubj = `<${datasetLocation}#Bookmark/${bookmarkItem.itemUrl}>`;

        const queryx = `INSERT { <${datasetLocation}> <http://www.schema.org/Contains> ${itemSubj} . }`;

        const query1 = `INSERT { ${itemSubj} <${thingType}> <${thingTypeThing}> . }`;
        const query2 = `INSERT { ${itemSubj} <${thingCreated}> "${bookmarkItem.itemCreated}" . }`;
        const query3 = `INSERT { ${itemSubj} <${thingTitle}> "${bookmarkItem.itemTitle}" . }`;
        const query4 = `INSERT { ${itemSubj} <${thingDescription}> "${bookmarkItem.itemDescription}" . }`;
        const query5 = `INSERT { ${itemSubj} <${thingUrl}> "${bookmarkItem.itemUrl}" . }`;


        const queries = [queryx, query1, query2, query3, query4, query5];

        queries.forEach(query => {

            window.fetch(datasetLocation, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/sparql-update'
                },
                body: query
            })
        });

        // Hide viwe:
        const a = document.getElementById('lexitagsView');
        a.remove();

    }





}