const { exec } = require('child_process');
const path = require('path');

exports.handler = async (event, context) => {
  const size = event.queryStringParameters.size;

  return new Promise((resolve, reject) => {
    const scriptPath = 'netlify/functions/python/generateMaze.py';

    exec(`python ${scriptPath} ${size}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Erreur de génération du labyrinthe' }),
        });
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      resolve({
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      });
    });
  });
};
