npm install
cd gatsby
npm install
cd ..

node init.js

rm -r public
rm -r gatsby/public
cd gatsby
npm run build
cd ..
mv gatsby/public public