const getPixels = require('get-pixels');

getPixels('public/logo.png', function(err, pixels) {
  if (err) {
    console.log("Bad image path");
    return;
  }
  
  let hasTransparentPixels = false;
  let hasSemiTransparentPixels = false;
  let fullyOpaquePixels = 0;
  
  const width = pixels.shape[0];
  const height = pixels.shape[1];
  
  // Check the corners and edges first (most likely to be transparent if it's a cutout)
  const edgePixels = [
    [0, 0], [width-1, 0], [0, height-1], [width-1, height-1],
    [Math.floor(width/2), 0], [Math.floor(width/2), height-1],
    [0, Math.floor(height/2)], [width-1, Math.floor(height/2)]
  ];
  
  console.log("Checking edge pixels:");
  edgePixels.forEach(pos => {
    const alpha = pixels.get(pos[0], pos[1], 3);
    console.log(`Pos (${pos[0]},${pos[1]}) Alpha:`, alpha);
  });
  
  for(let i = 0; i < pixels.data.length; i += 4) {
    const alpha = pixels.data[i + 3]; // RGBA, index 3 is alpha
    
    if (alpha === 0) {
      hasTransparentPixels = true;
    } else if (alpha < 255) {
      hasSemiTransparentPixels = true;
    } else {
      fullyOpaquePixels++;
    }
  }
  
  const totalPixels = width * height;
  
  console.log("\nTransparency Report:");
  console.log(`Total Pixels: ${totalPixels}`);
  console.log(`Opaque Pixels: ${fullyOpaquePixels} (${Math.round(fullyOpaquePixels/totalPixels*100)}%)`);
  console.log(`Has Fully Transparent Pixels (Alpha 0): ${hasTransparentPixels}`);
  console.log(`Has Semi-Transparent Pixels (Alpha 1-254): ${hasSemiTransparentPixels}`);
  
  if (!hasTransparentPixels && !hasSemiTransparentPixels) {
    console.log("\nCONCLUSION: The image is completely opaque (no transparency).");
  } else if (!hasTransparentPixels && hasSemiTransparentPixels) {
     console.log("\nCONCLUSION: The image only has partial transparency, likely from anti-aliasing, but no fully transparent background.");
  } else {
    console.log("\nCONCLUSION: The image contains fully transparent pixels.");
  }
});
