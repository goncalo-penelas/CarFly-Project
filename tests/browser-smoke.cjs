// Run with: node tests/browser-smoke.cjs
// Uses the installed Edge browser and Node's built-in DevTools client.
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const artifacts = fs.mkdtempSync(path.join(os.tmpdir(), 'carfly-browser-'));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  const target = file === root + path.sep ? path.join(root, 'index.html') : file;
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };
  fs.readFile(target, (error, data) => {
    res.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
    res.end(error ? '' : data);
  });
});

(async () => {
  let browser, ws, send;
  const errors = [];
  const excludedRequests = [];
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const edge = process.env.CARFLY_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
    browser = spawn(edge, ['--headless=new', '--remote-debugging-port=0',
      '--user-data-dir=' + path.join(artifacts, 'profile'), '--no-first-run',
      '--no-default-browser-check', '--autoplay-policy=no-user-gesture-required',
      '--window-size=1280,800', 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let output = '';
    browser.stderr.on('data', chunk => { output += chunk; });
    browser.on('error', error => { output += error.message; });
    const deadline = Date.now() + 20000;
    while (!/DevTools listening on (ws:\/\/[^\s]+)/.test(output)) {
      if (Date.now() > deadline || browser.exitCode !== null) throw new Error('Edge failed to start: ' + output.slice(-1500));
      await delay(100);
    }
    const endpoint = output.match(/DevTools listening on (ws:\/\/[^\s]+)/)[1];
    const targets = await (await fetch('http://' + new URL(endpoint).host + '/json/list')).json();
    ws = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
    let id = 0;
    const pending = new Map();
    ws.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const entry = pending.get(message.id);
        if (entry) { pending.delete(message.id); message.error ? entry.reject(message.error) : entry.resolve(message.result); }
      }
      if (message.method === 'Network.requestWillBeSent' && /\/assets\/audio\/|\/loner\.jpg/i.test(message.params.request.url)) excludedRequests.push(message.params.request.url);
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
      if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry);
    };
    send = (method, params = {}) => new Promise((resolve, reject) => {
      const next = ++id;
      const timeout = setTimeout(() => { pending.delete(next); reject(new Error('DevTools timeout: ' + method)); }, 30000);
      pending.set(next, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
      ws.send(JSON.stringify({ id: next, method, params }));
    });
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await send('Network.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
    await send('Page.navigate', { url: 'http://127.0.0.1:' + server.address().port + '/index.html' });
    console.log('Page opened');
    for (let i = 0; i < 100 && !await evaluate('typeof init === "function"'); i++) await delay(100);
    await evaluate('window.alert = function () {}; document.getElementById("botaoJogar").click();');
    console.log('Game started');
    for (let i = 0; i < 150 && !await evaluate('!!(jogo && jogo.pronto)'); i++) await delay(100);
    assert.equal(await evaluate('jogo.pronto'), true, 'FBX ready');
    console.log('FBX loaded');
    await evaluate('document.getElementById("botaoPausa").click();');
    assert.equal(await evaluate('jogo.status'), 'pausa');
    const paused = await evaluate('JSON.stringify([jogo.tempo,carro.position,planeta.rotation,arrayNuvens.map(n=>n.position)])');
    await delay(250);
    assert.equal(await evaluate('JSON.stringify([jogo.tempo,carro.position,planeta.rotation,arrayNuvens.map(n=>n.position)])'), paused, 'Pause freezes the world');
    await evaluate('handleMouseDown({which:1,target:document.getElementById("botaoPausa")});');
    assert.equal(await evaluate('Posicao_Carro.y'), 0);
    await evaluate('document.getElementById("botaoPausa").click();');
    assert.equal(await evaluate('jogo.status'), 'jogar');
    assert.equal(await evaluate('document.getElementById("botaoMusica")'), null);
    // Freeze time so screenshots and collision checks are reproducible.
    await evaluate('jogo.status="teste"; ReiniciarJogo(); jogo.status="teste";');
    const screenshot = async name => {
      await evaluate('Renderer.render(Cena,Camara)');
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifacts, name + '.png'), Buffer.from(shot.data, 'base64'));
    };
    await screenshot('perspetiva');
    await evaluate('createCamaras()'); await screenshot('lateral');
    assert.ok(await evaluate('Math.abs(Camara.getWorldDirection(new THREE.Vector3()).y) < 1e-10'), 'Camera must be horizontal');
    assert.ok(await evaluate('Math.abs(new THREE.Vector3(0,75,0).project(Camara).x) < 1e-10'), 'Planet centered horizontally');
    assert.ok(await evaluate('Estrada.parent === planeta && Relva.parent === planeta && Relva2.parent === planeta'));
    // Opposite grass caps must keep their orientation relative to the road.
    await evaluate('var antesRelativo = Estrada.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(Relva2.getWorldQuaternion(new THREE.Quaternion())); for(var frame=0;frame<90;frame++) updateElementos(1);');
    assert.ok(await evaluate('var depoisRelativo = Estrada.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(Relva2.getWorldQuaternion(new THREE.Quaternion())); antesRelativo.angleTo(depoisRelativo) < 1e-6'), 'Road and grass rotate as one');
    await screenshot('lateral-movimento');
    await evaluate('ReiniciarJogo(); jogo.status="teste";');
    assert.equal(await evaluate('planeta.rotation.z'), 0);
    assert.ok(await evaluate('var obst = arrayNuvens[0], deco = arrayNuvensDecorativas[0]; deco.position.x=300; var ox=obst.position.x, dx=deco.position.x; jogo.passo=0.5; moverNuvens(obst); moverNuvemDecorativa(deco); Math.abs((ox-obst.position.x)-(dx-deco.position.x)) < 1e-8'), 'Clouds share the same motion');
    await evaluate('ReiniciarJogo(); jogo.status="teste";');
    assert.deepEqual(await evaluate('[arraySinais.length,arrayNuvens.length,arrayNuvensDecorativas.length,arrayMoedas.length]'), [1, 1, 20, 1]);
    assert.equal(await evaluate('arrayNuvens[0].position.copy(carro.position); jogo.status="jogar"; detetarColisao(); jogo.status'), 'gameover');
    await evaluate('ReiniciarJogo(); jogo.status="teste";');
    assert.equal(await evaluate('var n=criarNuvem(); var b=new THREE.Box3(new THREE.Vector3(26.9,19.9,-.1),new THREE.Vector3(27.1,20.1,.1)); colideComObstaculo(n,[b])'), false);
    assert.equal(await evaluate('b.set(new THREE.Vector3(14,-1,-1),new THREE.Vector3(16,1,1)); colideComObstaculo(n,[b])'), true);
    await evaluate('jogo.status="jogar";handleKeyDown({keyCode:32}); jogo.status="teste";');
    assert.ok(await evaluate('arrayFumos.length > 0'));
    await evaluate('handleKeyUp({keyCode:32}); ReiniciarJogo(); jogo.status="teste";');
    assert.equal(await evaluate('arrayFumos.length'), 0);
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
    await delay(200);
    assert.deepEqual(await evaluate('[Renderer.domElement.clientWidth,Renderer.domElement.clientHeight]'), [390, 844]);
    assert.ok(Math.abs(await evaluate('Camara.right / Camara.top') - 390 / 844) < 0.001);
    await screenshot('lateral-390');
    await evaluate('createCamaras()'); await screenshot('perspetiva-390');
    assert.ok(Math.abs(await evaluate('Camara.aspect') - 390 / 844) < 0.001);
    const flight = await evaluate(`
      carro.position.y=100; Posicao_Carro.y=0; carro.rotation.z=0; updateElementos(1);
      var queda=100-carro.position.y, anguloDescida=carro.rotation.z;
      Posicao_Carro.y=VelocidadeAndar;
      for(var t=0;t<15;t++) updateElementos(1);
      var anguloSubida=carro.rotation.z;
      Posicao_Carro.y=0;
      ({queda:queda,descida:anguloDescida,subida:anguloSubida})
    `);
    assert.ok(Math.abs(flight.queda - 1.8) < 0.001);
    assert.ok(flight.descida < 0 && flight.subida > 0);
    const generated = await evaluate(`
      ReiniciarJogo(); jogo.status='teste';
      var menorIntervalo=Infinity, maiorQuantidade=0, passagens=true;
      var tamanhos=new Set(), tipos=new Set();
      for(var frame=0;frame<15000;frame++) {
        updateElementos(1);
        var objetos=arraySinais.concat(arrayNuvens).sort((a,b)=>a.position.x-b.position.x);
        maiorQuantidade=Math.max(maiorQuantidade,objetos.length);
        for(var i=1;i<objetos.length;i++) menorIntervalo=Math.min(menorIntervalo,objetos[i].position.x-objetos[i-1].position.x);
        objetos.forEach(function(o){
          tipos.add(o.userData.nuvem?'nuvem':'sinal'); tamanhos.add(o.scale.x.toFixed(4));
          if(o.userData.nuvem) passagens=passagens && new THREE.Box3().setFromObject(o).min.y>75;
        });
      }
      ({intervalo:menorIntervalo,quantidade:maiorQuantidade,passagens:passagens,tamanhos:tamanhos.size,tipos:tipos.size})
    `);
    assert.ok(generated.intervalo >= 740, 'Safe reaction distance at maximum speed');
    assert.equal(generated.quantidade, 6);
    assert.ok(generated.passagens && generated.tamanhos > 10 && generated.tipos === 2);
    await evaluate('ReiniciarJogo(); jogo.status="teste";');
    assert.equal(await evaluate('arraySinais.length+arrayNuvens.length'), 2);
    assert.equal(await evaluate('jogo.velocidade'), 2.5);
    assert.equal(excludedRequests.length, 0, 'Excluded media must not be requested');
    assert.equal(errors.length, 0, 'Browser errors');
    console.log(JSON.stringify({ passed: true, errors, artifacts }, null, 2));
  } finally {
    if (send && ws.readyState === WebSocket.OPEN) {
      send('Browser.close').catch(() => {});
      await delay(200);
      ws.close();
    }
    if (browser && browser.exitCode === null) browser.kill();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
