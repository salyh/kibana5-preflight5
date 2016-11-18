#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#git clone https://github.com/elastic/kibana.git
cd "$DIR/kibana"
export NVM_DIR=~/.nvm
mkdir -p $NVM_DIR
. $(brew --prefix nvm)/nvm.sh
nvm install "$(cat .node-version)"

cd "$DIR/preflight5"
rm -rf build/
npm install
npm start

