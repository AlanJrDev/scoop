const fs = require('fs');
const path = require('path');

const mergulhoDir = path.join(__dirname, 'public', 'mergulho');
const inicialDir = path.join(__dirname, 'public', 'inicial');

const files = fs.readdirSync(mergulhoDir).filter(f => f.endsWith('.jpg'));

files.forEach(file => {
  const numStr = file.replace(/[^0-9]/g, '');
  const oldNum = parseInt(numStr, 10);
  const newNum = oldNum + 187;
  const newName = `ezgif-frame-${newNum.toString().padStart(3, '0')}.jpg`;
  
  fs.renameSync(
    path.join(mergulhoDir, file),
    path.join(inicialDir, newName)
  );
  console.log(`Renamed ${file} to ${newName}`);
});
console.log('Done!');
