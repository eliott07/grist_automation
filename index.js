function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(async  
 function() {
  const statusElement = document.getElementById('status'); // Assuming an element with id 'status' exists

  try {
    statusElement.textContent = 'Fetching enabled records...';

    // Assuming 'linkedTable' is the name of your linked table
    const enabledRecords = await grist.tables.get('Formulaire_de_contact_Etalab').filter({ Nouveau_contact_Vrai_Faux_: true }).getAllRows();

    statusElement.textContent = 'Processing ' + enabledRecords.length + ' enabled records...';

    for (const record of enabledRecords) {
      statusElement.textContent = 'Processing record ' + record.id + '...';

      const actions = record.Actions;
      // Assuming 'actions' is a list of actions to be executed
      await grist.docApi.applyUserActions(actions);
    }

    statusElement.textContent = 'All records processed successfully.';
  } catch (error) {
    statusElement.textContent = 'Error processing records: ' + error.message;
    console.error('Error processing records:', error);
  }
});
