npm install
cd gatsby
npm install
cd ..

cp pre-init-config.js gatsby/pre-init-config.js
cp dbuser.js gatsby/dbuser.js
cp dbpassword.js gatsby/dbpassword.js

rm -r public
rm -r gatsby/public
cd gatsby
npm run build
cd ..
mv gatsby/public public


mkdir public/isp
mkdir public/isp/prj
cp public/about/index.html public/isp/prj/prj.html
cp ISP-Project-Final-Report.pdf public/isp/prj
cp ISP-Project-Final-Presentation.ppt public/isp/prj