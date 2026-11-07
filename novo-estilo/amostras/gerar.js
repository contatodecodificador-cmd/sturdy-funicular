// Gera as pranchas de amostra (1080x1920) a partir de prancha.html?d=N
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
for(const n of [1,2,3]){await p.goto('file://'+__dirname+'/prancha.html?d='+n);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:__dirname+`/direcao-${n}.png`});}
await b.close()})();
