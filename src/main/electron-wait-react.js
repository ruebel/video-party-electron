const net = require('net');
const port = process.env.PORT ? process.env.PORT - 100 : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () =>
  client.connect({ port: port }, () => {
    client.end();
    if (!startedElectron) {
      console.log('starting electron');
      startedElectron = true;
      const spawn = require('child_process').spawn;
      const temp = spawn('npm', ['run', 'electron']);
      temp.stdout.pipe(process.stdout);
      temp.stderr.pipe(process.stderr);
      temp.on('close', function (code) {
        console.log('closing code: ' + code);
      });
    }
  });

tryConnection();

client.on('error', error => {
  setTimeout(tryConnection, 1000);
});
