async function importCSVPeople(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(ev) {
    const text = ev.target.result;
    const lines = text.split('\n');
    let imported = 0;
    let skipped = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parsing delle colonne CSV (presume separatore virgola o punto e virgola)
      const cols = line.split(/[,;]/).map(c => c.replace(/^"|"$/g, '').trim());
      const cognome = cols[0] || '';
      const nome = cols[1] || '';
      const data_nascita = cols[2] || '';
      const luogo_nascita = cols[3] || '';

      if (!nome || !cognome) continue;

      // Controllo duplicati
      const dup = await db.persone.where({ nome, cognome }).first();
      if (!dup) {
        await db.persone.add({
          nome,
          cognome,
          data_nascita,
          luogo_nascita,
          foto: '',
          data_inserimento: new Date().toISOString()
        });
        imported++;
      } else {
        skipped++;
      }
    }

    alert(`Importazione completata!\nNuovi inseriti: ${imported}\nDuplicati saltati: ${skipped}`);
    navigate('persone');
  };
  reader.readAsText(file);
}