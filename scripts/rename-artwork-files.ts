import * as fs from 'fs';
import * as path from 'path';

// Use process.cwd() to get the project root directory
const PROJECT_ROOT = process.cwd();
const ARTWORK_DIR = path.join(PROJECT_ROOT, 'Prompt Guides', 'Artwork');
const CARD_JSON_DIR = path.join(PROJECT_ROOT, 'Prompt Guides', 'Card JSON');

interface RenameOperation {
  oldName: string;
  newName: string;
  suit: string;
  rank: string;
}

interface JsonFileInfo {
  filename: string;
  suit: string;
  rank: string;
  baseName: string; // filename without extension
}

function normalizeRank(rank: string): string {
  // Normalize rank: 'a' -> 'A', keep others as-is
  if (rank.toLowerCase() === 'a') {
    return 'A';
  }
  return rank;
}

function parseArtworkFilename(filename: string): { suit: string; rank: string } | null {
  // Parse format: {rank}_{suit}_final.png or {rank}_{suit}_final_final.png
  // Examples: a_spades_final.png, 10_clubs_final.png, 2_hearts_final_final.png
  const match = filename.match(/^([a0-9]+)_(spades|hearts|clubs|diamonds)_final/);
  if (match) {
    return {
      rank: normalizeRank(match[1]),
      suit: match[2]
    };
  }
  return null;
}

function parseJsonFilename(filename: string): JsonFileInfo | null {
  // Parse format: {id}_{suit}_{rank}_{name}.json
  // Examples: 001_spades_A_Pulquero.json, 022_hearts_6_Barril.json
  const match = filename.match(/^(\d{3})_(spades|hearts|clubs|diamonds)_([AKQJ0-9]+)_(.+)\.json$/);
  if (match) {
    return {
      filename: filename,
      suit: match[2],
      rank: match[3],
      baseName: path.parse(filename).name
    };
  }
  return null;
}

function main() {
  console.log('Reading Card JSON directory...');
  const jsonFiles = fs.readdirSync(CARD_JSON_DIR).filter(f => f.endsWith('.json'));
  
  // Create a map of suit+rank -> JSON file info
  const jsonMap = new Map<string, JsonFileInfo>();
  for (const jsonFile of jsonFiles) {
    const info = parseJsonFilename(jsonFile);
    if (info) {
      const key = `${info.suit}_${info.rank}`;
      jsonMap.set(key, info);
      console.log(`  Found JSON: ${key} -> ${info.baseName}`);
    }
  }

  console.log(`\nReading Artwork directory...`);
  const artworkFiles = fs.readdirSync(ARTWORK_DIR).filter(f => f.endsWith('.png'));
  
  const renameOperations: RenameOperation[] = [];
  
  for (const artworkFile of artworkFiles) {
    const parsed = parseArtworkFilename(artworkFile);
    if (!parsed) {
      console.log(`  ⚠️  Skipping ${artworkFile} - couldn't parse filename`);
      continue;
    }
    
    const key = `${parsed.suit}_${parsed.rank}`;
    const jsonInfo = jsonMap.get(key);
    if (!jsonInfo) {
      console.log(`  ⚠️  Skipping ${artworkFile} - no matching JSON found for ${key}`);
      continue;
    }
    
    const currentBaseName = path.parse(artworkFile).name;
    if (currentBaseName === jsonInfo.baseName) {
      console.log(`  ✓ ${artworkFile} - already matches`);
      continue;
    }
    
    const newName = `${jsonInfo.baseName}.png`;
    renameOperations.push({
      oldName: artworkFile,
      newName: newName,
      suit: parsed.suit,
      rank: parsed.rank
    });
    console.log(`  📝 ${artworkFile} -> ${newName}`);
  }

  if (renameOperations.length === 0) {
    console.log('\n✅ All files are already correctly named!');
    return;
  }

  console.log(`\n📋 Summary: ${renameOperations.length} file(s) to rename:`);
  renameOperations.forEach(op => {
    console.log(`  ${op.suit} ${op.rank}: ${op.oldName} -> ${op.newName}`);
  });

  // Check for --execute flag to actually perform the renames
  const shouldExecute = process.argv.includes('--execute') || process.argv.includes('-e');
  
  if (!shouldExecute) {
    console.log('\n⚠️  DRY RUN MODE - No files were renamed.');
    console.log('   To actually rename the files, run with --execute flag:');
    console.log('   npx tsx scripts/rename-artwork-files.ts --execute');
    return;
  }

  console.log('\n🔄 Performing renames...');
  let successCount = 0;
  let errorCount = 0;
  
  for (const op of renameOperations) {
    const oldPath = path.join(ARTWORK_DIR, op.oldName);
    const newPath = path.join(ARTWORK_DIR, op.newName);
    
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
