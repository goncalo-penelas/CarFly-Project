var arraySinais = [];
var modeloSinal;
var obstaculosIniciais = [];

function intervaloSeguroObstaculos() {
  // Altura total / descida + reacao e largura do carro e dos obstaculos.
  var seguro = jogo.velocidade * (190 / jogo.gravidade + 30) + 140;
  var dificuldade = Math.min(1, (jogo.velocidade - 2.5) / 2);
  return Math.max(seguro, 900 - dificuldade * 200);
}

function proximaPosicaoObstaculo() {
  var ultimo = arraySinais.concat(arrayNuvens).reduce(function (x, objeto) {
    return Math.max(x, objeto.position.x);
  }, -500);
  return Math.max(400, ultimo + intervaloSeguroObstaculos() + Math.random() * 160);
}

function assentarSinal(sinal) {
  var x = sinal.position.x, z = sinal.position.z;
  sinal.visible = Math.abs(x) < 560;
  var raio = Math.sqrt(600 * 600 - z * z);
  sinal.position.y = Math.sqrt(Math.max(0, raio * raio - x * x)) - 600;
  sinal.rotation.z = -Math.asin(Math.max(-1, Math.min(1, x / raio)));
}

function moverSinal(sinal) {
  sinal.position.x -= jogo.velocidade * (jogo.passo || 1);
  assentarSinal(sinal);
}

function criarObstaculo(tipo) {
  var x = proximaPosicaoObstaculo();
  var objeto;
  if (tipo === 'sinal' && modeloSinal) {
    objeto = modeloSinal.clone(true);
    objeto.position.set(x, 0, 0);
    objeto.scale.setScalar((65 + Math.random() * 45) / modeloSinal.userData.alturaModelo);
    assentarSinal(objeto);
    arraySinais.push(objeto);
    estrada.add(objeto);
  } else {
    objeto = criarNuvem();
    objeto.position.set(x, 120 + Math.random() * 55, (Math.random() - 0.5) * 8);
    objeto.scale.setScalar(0.55 + Math.random() * 0.5);
    objeto.rotation.set(0, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.2);
    arrayNuvens.push(objeto);
    Cena.add(objeto);
  }
  return objeto;
}

function gerirObstaculos() {
  arraySinais.concat(arrayNuvens).forEach(function (objeto) {
    if (objeto.position.x >= carro.position.x - 200) return;
    var lista = arraySinais.includes(objeto) ? arraySinais : arrayNuvens;
    if (lista === arraySinais) jogo.pontuacao += jogo.valorObstaculo;
    lista.splice(lista.indexOf(objeto), 1);
    objeto.parent.remove(objeto);
  });
  var dificuldade = Math.min(1, (jogo.velocidade - 2.5) / 2);
  var quantidade = 2 + Math.floor(dificuldade * 4);
  while (arraySinais.length + arrayNuvens.length < quantidade) {
    criarObstaculo(Math.random() < 0.5 ? 'sinal' : 'nuvem');
  }
  arrayMoedas.forEach(function (moeda) {
    if (!faixaLivreParaMoeda(moeda.position.x)) NovaMoeda(moeda);
  });
}

function prepararObstaculosIniciais() {
  var primeiro = Math.random() < 0.5 ? 'sinal' : 'nuvem';
  criarObstaculo(primeiro);
  criarObstaculo(primeiro === 'sinal' ? 'nuvem' : 'sinal');
  obstaculosIniciais = arraySinais.concat(arrayNuvens);
  obstaculosIniciais.forEach(guardarEstadoInicial);
  arrayMoedas.forEach(function (moeda) {
    if (!faixaLivreParaMoeda(moeda.position.x)) NovaMoeda(moeda);
    guardarEstadoInicial(moeda);
  });
  jogo.pronto = true;
}

function reporObstaculosIniciais() {
  arraySinais.concat(arrayNuvens).forEach(function (objeto) { objeto.parent.remove(objeto); });
  arraySinais = [];
  arrayNuvens = [];
  obstaculosIniciais.forEach(function (objeto) {
    reporEstadoInicial(objeto);
    if (objeto.userData.nuvem) { arrayNuvens.push(objeto); Cena.add(objeto); }
    else { arraySinais.push(objeto); estrada.add(objeto); }
  });
}

function addSinal() {
  var recursos = new THREE.LoadingManager();
  recursos.setURLModifier(function (url) {
    return /4224\.jpg$/i.test(url) ? 'assets/images/stop.svg' : url;
  });
  new THREE.FBXLoader(recursos).load('./assets/models/stopsign.fbx', function (modelo) {
    modelo.rotation.y = Math.PI / 2;
    modelo.traverse(function (child) {
      if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
    });
    var limites = new THREE.Box3().setFromObject(modelo);
    modelo.position.set(-(limites.min.x + limites.max.x) / 2,
      -limites.min.y, -(limites.min.z + limites.max.z) / 2);
    modeloSinal = new THREE.Object3D();
    modeloSinal.add(modelo);
    modeloSinal.userData.alturaModelo = limites.max.y - limites.min.y;
    prepararObstaculosIniciais();
  }, undefined, function (erro) {
    console.error(erro);
    prepararObstaculosIniciais();
  });
}
