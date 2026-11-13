import {readFileSync,existsSync} from 'node:fs';
const required=['index.html','manifest.webmanifest','sw.js','assets/app.mjs','assets/core.mjs','assets/i18n.mjs','assets/store.mjs','assets/base.css','assets/order.css','assets/icons.mjs','assets/icon.svg','assets/icon-192.png','assets/icon-512.png','privacy.html','terms.html','about.html','help.html','contact.html','delete-data.html','ANDROID-NOTES.md','README.md'];
for(const f of required){if(!existsSync(f))throw Error('Missing '+f);}
const html=readFileSync('index.html','utf8');
for(const asset of ['./assets/app.mjs','./assets/base.css','./assets/order.css','./manifest.webmanifest'])if(!html.includes(asset))throw Error('Index missing '+asset);
const sw=readFileSync('sw.js','utf8');for(const x of required.filter(x=>!['ANDROID-NOTES.md','README.md'].includes(x)))if(!sw.includes(`'./${x}'`)&&!['sw.js'].includes(x))throw Error('Service worker missing '+x);
for(const f of ['privacy.html','contact.html','terms.html','help.html','about.html','delete-data.html']){if(!readFileSync(f,'utf8').includes('OrderBanao'))throw Error(f+' is not branded');}
console.log('All required files, service-worker assets and page references are present.');
