npm install
cd gatsby
npm install
cd ..

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