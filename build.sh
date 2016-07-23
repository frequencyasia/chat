#!/bin/bash -x
exec &> githook.log

npm prune
npm install

pm stop index
pm start index.js