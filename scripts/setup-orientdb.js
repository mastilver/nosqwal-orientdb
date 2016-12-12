const execa = require('execa');
const axios = require('axios');
const pRetry = require('p-retry');

checkDockerIsInstalled();
killAllContainers();

launchContainer('orientdb', 'orientdb', [
    2424,
    2480
], {}, {
    ORIENTDB_ROOT_PASSWORD: 'password'
});

pRetry(() => {
    console.log('server starting');
    return axios.post('http://localhost:2480/database/default/plocal', {}, {
        auth: {
            username: 'root',
            password: 'password'
        }
    });
});

/*  -----  */

function killAllContainers() {
    execa.sync('docker', ['ps', '-a', '-q']).output[1]
        .split('\n')
        .filter(x => x !== '')
        .forEach(hash => execute('docker', ['rm', '-f', hash]));
}

function launchContainer(name, image, ports, volumes, envs) {
    execute('docker', ['pull', image]);

    const args = ['run', '-d'];

    Object.keys(volumes).forEach(localPath => {
        const containerPath = volumes[localPath];
        args.push('-v', `${localPath}:${containerPath}`);
    });

    Object.keys(envs).forEach(name => {
        const value = envs[name];
        args.push('-e', `${name}=${value}`);
    });

    ports.forEach(port => {
        args.push('-p', `${port}:${port}`);
    });

    args.push('--name', name);

    args.push(image);

    execute('docker', args);
}

function checkDockerIsInstalled() {
    execute('docker', ['version']);
}

function execute() {
    const args = Array.from(arguments);
    const result = execa.sync.apply(this, args);

    if (result.stderr !== '') {
        throw new Error(result.stderr);
    }

    return result;
}
