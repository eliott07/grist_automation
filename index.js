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
    msg = 'Fetching enabled records...';
    setStatus(msg);
    
    // Assuming 'linkedTable' is the name of your linked table
    const enabledRecords = await grist.tables.get('Formulaire_de_contact_Etalab').filter({ Nouveau_contact_Vrai_Faux_: true }).getAllRows();

    msg = 'Processing ' + enabledRecords.length + ' enabled records...';
    setStatus(msg);

    
    for (const record of enabledRecords) {
      msg = 'Processing record ' + record.id + '...';
      setStatus(msg);
      
      const actions = record.actions;
      // Assuming 'actions' is a list of actions to be executed
      await grist.docApi.applyUserActions(actions);
    }

    msg = 'All records processed successfully.';
    setStatus(msg);
    
  } catch (error) {
    msg = 'Error processing records: ' + error.message;
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
