import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const socialImageConfig = [
  {
    name: 'og-homepage.png',
    title: 'Cadena Bitcoin',
    description: 'Decentralized Bitcoin Lending',
    background: '#F7931A', // Bitcoin orange
  },
  // Add more page-specific social image configs here
];

async function generateSocialImages() {
  for (const config of socialImageConfig) {
    const width = 1200;
    const height = 630;

    const image = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 247, g: 147, b: 26, alpha: 1 }, // Bitcoin orange
      }
    })
    .composite([
      {
        input: Buffer.from(`
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <style>
              .title { fill: white; font-family: Arial, sans-serif; font-size: 72px; font-weight: bold; }
              .description { fill: white; font-family: Arial, sans-serif; font-size: 48px; }
            </style>
            <text x="5%" y="40%" class="title">${config.title}</text>
            <text x="5%" y="55%" class="description">${config.description}</text>
          </svg>
        `),
        input: Buffer.from(`
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,50 L1150,50 L1150,580 L50,580 Z" fill="none" stroke="white" stroke-width="4"/>
          </svg>
        `),
        top: 0,
        left: 0,
      }
    ])
    .png()
    .toFile(path.join(process.cwd(), 'public', config.name));

    console.log(`Generated social image: ${config.name}`);
  }
}

generateSocialImages().catch(console.error);