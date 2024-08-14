const statusElement = document.getElementById('status'); // Assuming an element with id 'status' exists

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(async  
 function() {

  grist.ready({
    requiredAccess: "full";
    columns: [
      { name: "actions", type: "Any", strictType: true, title: "Actions", description: "List of user actions to execute. As each user action definition is a list, this column must hold a list of lists. See https://github.com/gristlabs/grist-core/blob/main/documentation/overview.md#changes-to-documents" },
      { name: "isEnabled", type: "Bool", title: "Enabled?", description: "If this column's value is False, the widget won't do anything." },
    ],
  });
  

  try {
    statusElement.textContent = 'Fetching enabled records...';

    // Assuming 'linkedTable' is the name of your linked table
    const enabledRecords = await grist.tables.get('Formulaire_de_contact_Etalab').filter({ Nouveau_contact_Vrai_Faux_: true }).getAllRows();

    statusElement.textContent = 'Processing ' + enabledRecords.length + ' enabled records...';

    for (const record of enabledRecords) {
      statusElement.textContent = 'Processing record ' + record.id + '...';

      const actions = record.actions;
      // Assuming 'actions' is a list of actions to be executed
      await grist.docApi.applyUserActions(actions);
    }

    statusElement.textContent = 'All records processed successfully.';
  } catch (error) {
    statusElement.textContent = 'Error processing records: ' + error.message;
    console.error('Error processing records:', error);
  }
});
