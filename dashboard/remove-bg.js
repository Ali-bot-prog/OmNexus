const { Rembg } = require("rembg-node");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const inputPath = path.join(__dirname, "public", "logo.png");
const outputPath = path.join(__dirname, "public", "logo-transparent.png");

async function removeBackground() {
  try {
    console.log("Reading input image...");
    const inputBuffer = fs.readFileSync(inputPath);
    
    console.log("Initializing Rembg...");
    const rembg = new Rembg({
      logging: true,
    });
    
    console.log("Removing background... This may take a moment.");
    const outputImage = await rembg.remove(sharp(inputBuffer));
    
    console.log("Saving transparent image...");
    await outputImage.toFile(outputPath);
    
    // Replace the original with the transparent one
    fs.renameSync(outputPath, inputPath);
    
    console.log("Successfully removed background and replaced logo.png!");
  } catch (error) {
    console.error("Error removing background:", error);
  }
}

removeBackground();
