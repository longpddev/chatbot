import dotenv from 'dotenv';
import { existsSync } from 'fs';

function getConfigFile () {
  let fileName: { path: string } = {path: './.env'};

  const mode = process.env.NODE_ENV
  if(mode) {
    const filePathByMode = `./.env.${mode}`;
    if(existsSync(filePathByMode)) {
      fileName = {
        path: filePathByMode
      }
    }
  }

  console.log(`
  -----load config from file: ${typeof fileName === 'object' ? fileName.path : fileName}------
  `)
  return fileName
}

dotenv.config(getConfigFile())
