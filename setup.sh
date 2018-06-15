#!/bin/bash

npm prune

npm install
if [[ "$?" == 0 ]]; then
  printf "\tnpm install passed"
else
  printf "\tnpm install failed"
  exit 1
fi
cp hooks/pre-commit .git/hooks/
chmod +x .git/hooks/pre-commit
chmod +x generate-docs.sh