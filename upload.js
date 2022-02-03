const s3 = require('s3');
const fs = require('fs-extra');
const path = require('path');
const logUpdate = require('log-update');

(async function() {
  try {

    const { version } = fs.readJsonSync(path.join(__dirname, 'package.json'));

    const platform = process.argv[process.argv.length - 1];
    const nativeBuildDir = path.join(__dirname, 'build-native');

    const {
      S3_BUCKET,
      SNS_TOPIC,
      GITHUB_SHA,
      GITHUB_EVENT_NAME,
      GITHUB_REF,
    } = process.env;

    let buildPath;
    switch(platform) {
      case 'linux': {
        const appImage = fs.readdirSync(nativeBuildDir).find(f => path.extname(f) === '.AppImage');
        buildPath = path.join(nativeBuildDir, appImage);
        break;
      } case 'mac': {
        const zip = fs.readdirSync(nativeBuildDir).find(f => path.extname(f) === '.zip');
        buildPath = path.join(nativeBuildDir, zip);
        break
      } case 'win': {
        const zip = fs.readdirSync(nativeBuildDir).find(f => path.extname(f) === '.zip');
        buildPath = path.join(nativeBuildDir, zip);
        break;
      } default:
        throw new Error(`Missing platform argument. Argument must be one of "linux", "mac", or "win" e.g node ./upload win`);
    }

    const name = path.basename(buildPath);

    const necessaryEnvironmentVariables = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_REGION',
      'S3_BUCKET',
      'SNS_TOPIC',
    ];

    for(const varName of necessaryEnvironmentVariables) {
      if(!process.env[varName])
        throw new Error(`Missing required environment variable ${varName}`);
    }

    const sns = new s3.AWS.SNS();

    const sha = GITHUB_SHA.slice(0, 7);
    const s3Key = `${version}/${sha}/${name}`;
    const endpoint = `https://${S3_BUCKET}.s3.amazonaws.com/${s3Key}`;
    const titleVersion = `${version}#${sha}`;

    const client = s3.createClient();
    const params = {
      localFile: buildPath,
      s3Params: {
        Bucket: S3_BUCKET,
        Key: s3Key,
        ACL: 'public-read',
      }
    };

    console.log(`Upload ${buildPath} to ${endpoint}`);

    await new Promise((resolve, reject) => {
      const uploader = client.uploadFile(params);
      uploader.on('error', err => {
        reject(err);
      });
      uploader.on('progress', () => {
        const { progressAmount, progressTotal } = uploader;
        const percent = Math.floor((progressAmount / progressTotal) * 100);
        const progressMessage = `Upload progress: ${percent}%`;
        logUpdate(progressMessage);
      });
      uploader.on('end', () => {
        console.log(`Successfully uploaded to ${endpoint}`);
        resolve();
      });
    });

    const branchName = GITHUB_REF.split(/\//g).reverse()[0];
    const event = GITHUB_EVENT_NAME === 'pull' ? `Pull Request from ${branchName}` : `Push to ${branchName}`;

    await new Promise(resolve => {
      const osStr = platform === 'linux' ? 'Linux' : platform === 'mac' ? 'macOS' : 'Windows';
      const message = `New Pocket Wallet ${osStr} build available! Build triggered by ${event}.\n\n${endpoint}\n`;
      sns.publish({
        TopicArn: SNS_TOPIC,
        Subject: `Pocket Wallet ${titleVersion} for ${osStr}`,
        Message: message,
      }, err => {
        if(err) console.error(err);
        resolve();
      });
    });

  } catch(err) {
    console.error(err);
    process.exit(1);
  }
})();
