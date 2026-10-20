const https = require('https');

async function checkRegistry(packageName) {
    console.log(`Checking package: ${packageName}...`);
    const npmExists = await checkNpm(packageName);
    if (npmExists) {
        console.log(`[CLEAR] Package '${packageName}' exists safely on npm.`);
        return;
    }
    const pypiExists = await checkPypi(packageName);
    if (pypiExists) {
        console.log(`[CLEAR] Package '${packageName}' exists safely on PyPI.`);
        return;
    }
    console.log(`[HIGH_RISK_HALLUCINATION] Warning: '${packageName}' does NOT exist on npm or PyPI! Potential AI hallucination or cybersquatting risk.`);
}

function checkNpm(name) {
    return new Promise((resolve) => {
        https.get(`https://registry.npmjs.org/${encodeURIComponent(name)}`, (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => resolve(false));
    });
}

function checkPypi(name) {
    return new Promise((resolve) => {
        https.get(`https://pypi.org/pypi/${encodeURIComponent(name)}/json`, (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => resolve(false));
    });
}

async function run() {
    const args = process.argv.slice(2);
    const pkg = args[0] || 'lodash';
    await checkRegistry(pkg);
}

run();
