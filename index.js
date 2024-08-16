const statusElement = document.getElementById('status'); // Assuming an element with id 'status' exists

let msg = "";

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(async function() {

  grist.ready({
    requiredAccess: "full",
    columns: [
      { name: "actions", type: "Any", strictType: true, title: "Actions", description: "List of user actions to execute. As each user action definition is a list, this column must hold a list of lists. See https://github.com/gristlabs/grist-core/blob/main/documentation/overview.md#changes-to-documents" },
      { name: "isEnabled", type: "Bool", title: "Enabled?", description: "If this column's value is False, the widget won't do anything." },
    ],
  });
  

  try {
    msg = msg + 'Fetching enabled records...';
    setStatus(msg);
    
    // Assuming 'linkedTable' is the name of your linked table
    const table = await grist.docApi.fetchTable('Formulaire_de_contact_Etalab');
    const records = toRecordMap(table);

    console.log(table);
    console.log(records);
    
    msg = msg + 'Processing ' + records.length + ' records records...';
    setStatus(msg);

    
    for (const [key, value] of records) {
      console.log([key, value]);
      msg = msg + 'Processing record ' + key + '...';
      setStatus(msg);
      if(value.Nouveau_contact_Vrai_Faux_){
        
        const actions = value.Actions.slice(1);

        console.log(actions);
        
        const dict = actions[0][4];

        console.log(dict);
        actions[0][4] = dict[1];
        action_final = actions[0].slice(1);
        
        console.log(action_final);
      // Assuming 'actions' is a list of actions to be executed
        await grist.docApi.applyUserActions(action_final);
      }
    }

    msg = msg + 'All records processed successfully.';
    setStatus(msg);
    
  } catch (error) {
    msg = msg + 'Error processing records: ' + error.message;
    setStatus(msg);
    console.error('Error processing records:', error);
  }
});

function setStatus(msg) {
  let statusElem = document.querySelector("#status");
  if (!statusElem) return false;
  statusElem.innerHTML = msg;
  setVisible("#status", true);
  return true;
}

function setVisible(querySelector, isVisible) {
  let elem = document.querySelector(querySelector);
  if (!elem) return false;
  elem.style.display = isVisible ? "block" : "none";
}


function toRecordMap(columnData) {
  const fieldNames = Object.keys(columnData);
  return new Map(columnData.id.map((id, index) => {
    const values = fieldNames.map(col => [col, columnData[col][index]]);
    return [id, Object.fromEntries(values)];
  }));
}
