// src/helpers/precompile.js
import { XMLHttpRequest } from 'xmlhttprequest';
global.XMLHttpRequest = XMLHttpRequest;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveLygia } from 'resolve-lygia';

// Establish __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust the path to your shader files relative to the helpers folder
const fragmentShaderPath = path.join(__dirname, '../shaders/fragment.glsl');

// Read the raw shader source
const rawShaderSource = fs.readFileSync(fragmentShaderPath, 'utf8');

// Process the shader source at build time
const processedShaderSource = resolveLygia(rawShaderSource);

// Write the processed shader to a new file
const outputPath = path.join(__dirname, '../shaders/fragment.precompiled.glsl');
fs.writeFileSync(outputPath, processedShaderSource, 'utf8');

console.log('Fragment shader precompiled and saved to:', outputPath);
