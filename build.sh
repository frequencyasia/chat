#!/bin/bash -x
exec &> githook.log

npm prune
npm install

pm2 stop index
pm2 start index.js