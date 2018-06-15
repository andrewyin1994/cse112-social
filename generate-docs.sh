#!/bin/bash

jsdoc -r public 
git add out/
git commit -m "Autogenerate JSDoc documentation in out/ directory"
