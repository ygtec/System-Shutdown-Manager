const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

(async () => {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const svgPath = path.join(projectRoot, 'src', 'renderer', 'logo.svg');
    const outDir = path.join(projectRoot, 'build', 'icons', 'win');
    const outPath = path.join(outDir, 'icon.ico');

    if (!fs.existsSync(svgPath)) {
      throw new Error(`找不到 SVG：${svgPath}`);
    }

    fs.mkdirSync(outDir, { recursive: true });

    const svgBuffer = fs.readFileSync(svgPath);
    // Windows 资源嵌入需要标准尺寸，且必须包含 256x256
    const sizes = [16, 24, 32, 48, 64, 128, 256];
    const pngBuffers = await Promise.all(
      sizes.map((size) => 
        sharp(svgBuffer)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toBuffer()
      )
    );

    const icoBuffer = await toIco(pngBuffers);
    fs.writeFileSync(outPath, icoBuffer);
    console.log(`✓ 已生成 Windows ICO（${sizes.length} 个尺寸）：${outPath}`);
    console.log(`  尺寸：${sizes.join('×, ')}×`);
  } catch (err) {
    console.error('✗ 生成 ICO 失败：', err);
    process.exit(1);
  }
})();
