#!/bin/bash

echo "Running React Build"
npm run build --workspace=client
echo "Updating asset paths for electron"
sed -i -e 's/\/static/static/g' ./desktop/client/index.html
sed -i -e 's/\/manifest/manifest/g' ./desktop/client/index.html
sed -i -e 's/\/favicon/favicon/g' ./desktop/client/index.html
rm ./desktop/client/index.html-e