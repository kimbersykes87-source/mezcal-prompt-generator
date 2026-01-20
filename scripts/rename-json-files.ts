import * as fs from 'fs';
import * as path from 'path';

// Use process.cwd() to get the project root directory
const PROJECT_ROOT = process.cwd();
const CARD_IMAGES_DIR = path.join(PROJECT_ROOT, 'Prompt Guides', 'Card Images');
const CARD_JSON_DIR = path.join(PROJECT_ROOT, 'Prompt Guides', 'Card JSON');

interface RenameOperation {
  oldName: string;
  newName: string;
  id: string;
}

function extractId(filename: string): string | null {
  // Extract the three-digit ID from the start of the filename
  const match = filename.match(/^(\d{3})_/);
  return match ? match[1] : null;
}

function getBaseName(filename: string): string {
  // Remove extension and return base name
  return path.parse(filename).name;
}

function main() {
  console.log('Reading Card JSON directory...');
  const jsonFiles = fs.readdirSync(CARD_JSON_DIR).filter(f => f.endsWith('.json'));
  
  // Create a map of ID -> base filename from JSON files (without extension)
  const jsonMap = new Map<string, string>();
  for (const jsonFile of jsonFiles) {
    const id = extractId(jsonFile);
    if (id) {
      const baseName = getBaseName(jsonFile);
      jsonMap.set(id, baseName);
      console.log(`  Found JSON: ${id} -> ${baseName}`);
    }
  }

  console.log(`\nReading Card Images directory...`);
  const imageFiles = fs.readdirSync(CARD_IMAGES_DIR).filter(f => f.endsWith('.jpg'));
  
  const renameOperations: RenameOperation[] = [];
  
  for (const imageFile of imageFiles) {
    const id = extractId(imageFile);
    if (!id) {
      console.log(`  ⚠️  Skipping ${imageFile} - no ID found`);
      continue;
    }
    
    const expectedBaseName = jsonMap.get(id);
    if (!expectedBaseName) {
      console.log(`  ⚠️  Skipping ${imageFile} - no matching JSON found for ID ${id}`);
      continue;
    }
    
    const currentBaseName = getBaseName(imageFile);
    if (currentBaseName === expectedBaseName) {
      console.log(`  ✓ ${imageFile} - already matches`);
      continue;
    }
    
    const newName = `${expectedBaseName}.jpg`;
    renameOperations.push({
      oldName: imageFile,
      newName: newName,
      id: id
    });
    console.log(`  📝 ${imageFile} -> ${newName}`);
  }

  if (renameOperations.length === 0) {
    console.log('\n✅ All files are already correctly named!');
    return;
  }

  console.log(`\n📋 Summary: ${renameOperations.length} file(s) to rename:`);
  renameOperations.forEach(op => {
    console.log(`  ${op.id}: ${op.oldName} -> ${op.newName}`);
  });

  // Check for --execute flag to actually perform the renames
  const shouldExecute = process.argv.includes('--execute') || process.argv.includes('-e');
  
  if (!shouldExecute) {
    console.log('\n⚠️  DRY RUN MODE - No files were renamed.');
    console.log('   To actually rename the files, run with --execute flag:');
    console.log('   npx tsx scripts/rename-json-files.ts --execute');
    return;
  }

  console.log('\n🔄 Performing renames...');
  let successCount = 0;
  let errorCount = 0;
  
  for (const op of renameOperations) {
    const oldPath = path.join(CARD_IMAGES_DIR, op.oldName);
    const newPath = path.join(CARD_IMAGES_DIR, op.newName);
    
    // Check if target already exists
    if (fs.existsSync(newPath)) {
      console.error(`  ❌ Cannot rename ${op.oldName} -> ${op.newName}: target already exists`);
      errorCount++;
      continue;
    }
    
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`  ✅ Renamed: ${op.oldName} -> ${op.newName}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Error renaming ${op.oldName}:`, error);
      errorCount++;
    }
  }
  
  console.log(`\n✅ Rename operation complete!`);
  console.log(`   Success: ${successCount}, Errors: ${errorCount}`);
}

main();
