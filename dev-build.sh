#!/bin/bash -x
exec &> githook.log

npm prune
npm install