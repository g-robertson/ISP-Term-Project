npm install
cd gatsby
npm install
cd ..

node init.js
cp pre-init-config.js gatsby/pre-init-config.js
cp dbuser.js gatsby/dbuser.js
cp dbpassword.js gatsby/dbpassword.js

rm -r public
rm -r gatsby/public
cd gatsby
npm run build
cd ..
mv gatsby/public public
