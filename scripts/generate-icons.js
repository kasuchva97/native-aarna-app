const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const SOURCE_ICON = path.join(__dirname, '../assets/logo512.png');
const ANDROID_RES_DIR = path.join(__dirname, '../android/app/src/main/res');

const iconSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

async function generateIcons() {
  console.log('🚀 Starting Adaptive Icon generation...');
  
  try {
    const baseImage = await Jimp.read(SOURCE_ICON);
    
    for (const item of iconSizes) {
      const targetDir = path.join(ANDROID_RES_DIR, item.folder);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 1. Generate Legacy Square Icon
      console.log(`  - Generating ${item.folder}/ic_launcher.png (${item.size}x${item.size})`);
      const squareIcon = baseImage.clone();
      squareIcon.resize({ w: item.size, h: item.size });
      await squareIcon.write(path.join(targetDir, 'ic_launcher.png'));

      // 2. Generate Legacy Round Icon
      console.log(`  - Generating ${item.folder}/ic_launcher_round.png (${item.size}x${item.size})`);
      const roundIcon = baseImage.clone();
      roundIcon.resize({ w: item.size, h: item.size });
      roundIcon.circle();
      await roundIcon.write(path.join(targetDir, 'ic_launcher_round.png'));

      // 3. Generate Adaptive Foreground Icon
      // The foreground should be the logo centered with padding to avoid clipping.
      console.log(`  - Generating ${item.folder}/ic_launcher_foreground.png (${item.size}x${item.size})`);
      const foregroundSize = Math.floor(item.size * 0.8); // 80% size for the logo content
      const logoContent = baseImage.clone();
      logoContent.resize({ w: foregroundSize, h: foregroundSize });
      
      // Create a transparent canvas
      const canvas = new Jimp({ 
        width: item.size, 
        height: item.size, 
        color: 0x00000000 
      });
      
      // Composite logo in the center
      canvas.composite(logoContent, (item.size - foregroundSize) / 2, (item.size - foregroundSize) / 2);
      await canvas.write(path.join(targetDir, 'ic_launcher_foreground.png'));
    }

    console.log('✅ Adaptive Icons generated successfully!');
  } catch (err) {
    console.error('❌ Error generating icons:', err.message || err);
    process.exit(1);
  }
}

generateIcons();
