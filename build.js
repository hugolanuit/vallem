const { exec } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const PROCESS_PATH = path.join(process.cwd());
const { DOMAIN } = process.env

exec(`${PROCESS_PATH}/node_modules/.bin/parcel build ./index.njk --public-url ${DOMAIN} --no-source-maps`, (error, stdout, stderr) => {

  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  // output build message
  console.log(`${stdout}`);
});
