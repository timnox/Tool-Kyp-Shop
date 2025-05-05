const fs = require('fs');
const path = require('path');

// Paths to config.js and Commands directory
const configPath = path.join(__dirname, 'config.js');
const commandsDir = path.join(__dirname, 'Commands');

try {
  // 1) Update config.js
  let configContent = fs.readFileSync(configPath, 'utf8');
  // Replace any line starting with color: with the fallback version
  const configLines = configContent.split(/\r?\n/).map(line => {
    if (/^\s*color\s*:\s*/.test(line)) {
      return "  color: \"#\" + (process.env.COLOR || \"FF0000\"),";
    }
    return line;
  });
  configContent = configLines.join("\n");
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('✅ config.js mis à jour avec le fallback couleur.');

  // 2) Update all command files
  const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
  commandFiles.forEach(file => {
    const filePath = path.join(commandsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Inject validation at start of execute if not already
    if (!/const isHex =/.test(content)) {
      content = content.replace(
        /execute\s*\(.*?\)\s*{/, match => `${match}\n    // Validation de la couleur hex\n    const isHex = /^#[0-9A-Fa-f]{6}$/.test(config.color);\n    const embedColor = isHex ? config.color : \"#FF0000\";`
      );
    }

    // Replace setColor calls using config.color with embedColor
    content = content.replace(/\.setColor\(\s*config\.color\s*\)/g, '.setColor(embedColor)');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} mis à jour.`);
  });

  console.log('🎉 Toutes les commandes ont été mises à jour !');
} catch (err) {
  console.error('❌ Une erreur est survenue lors de la mise à jour :', err);
}