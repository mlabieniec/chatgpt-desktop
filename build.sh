#!/bin/bash

echo "Running React Build"
npm run build --workspace=client
echo "Moving React client files"
mv -f ./desktop/client/* ./desktop/
echo "Updating asset paths for electron"
sed -i -e 's/\/static/static/g' ./desktop/index.html
rm ./desktop/index.html-e
rm -fR ./desktop/client/*