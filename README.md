# dl-wallet

## Getting Started
1. Install [Node.js](https://nodejs.org/en/)
2. Install yarn package manager: `npm install -g yarn`
3. Clone repo: `git clone https://github.com/pokt-foundation/dl-wallet.git`
4. Enter directory: `cd dl-wallet`
5. Install dependencies: `yarn`

## Start application
1. Start development server: `yarn start`
2. Start electron application: `yarn run start-app`

## Run Tests
Set environment variable `CI` to `true` and run `yarn run test-all`

## Windows builds via docker
1. `docker build -t pocket-wallet-build-win -f Dockerfile-build-win .`
2. `docker run --rm -ti -v [path to local output directory]:/pocket-wallet/build-native pocket-wallet-build-win`

## macOS builds via docker
1. `docker build -t pocket-wallet-build-mac -f Dockerfile-build-mac .`
2. `docker run --rm -ti -v [path to local output directory]:/pocket-wallet/build-native pocket-wallet-build-mac`

## Linux builds via docker
1. `docker build -t pocket-wallet-build-linux -f Dockerfile-build-linux .`
2. `docker run --rm -ti -v [path to local output directory]:/pocket-wallet/build-native pocket-wallet-build-linux`
