
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'node_modules', 'cesium', 'Build', 'Cesium');
const destDir = path.join(__dirname, '..', 'public', 'cesium');

const dirsToCopy = ['Workers', 'ThirdParty', 'Assets', 'Widgets'];

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Copying Cesium assets...');
try {
    dirsToCopy.forEach(dir => {
        const src = path.join(srcDir, dir);
        const dest = path.join(destDir, dir);
        if (fs.existsSync(src)) {
            console.log(`Copying ${dir}...`);
            copyDir(src, dest);
        } else {
            console.warn(`Source folder not found: ${src}`);
        }
    });
    console.log('Cesium assets copied successfully.');
} catch (error) {
    console.error('Error copying Cesium assets:', error);
}
