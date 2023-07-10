import dotenv from 'dotenv';
import { existsSync } from 'fs';

function getConfigFile () {
  let fileName: { path: string } | undefined;

  const mode = process.env.NODE_ENV
  if(mode) {
    const filePathByMode = `./.env.${mode}`;
    if(existsSync(filePathByMode)) {
      fileName = {
        path: filePathByMode
      }
    }
  }
  return fileName
}

dotenv.config(getConfigFile())