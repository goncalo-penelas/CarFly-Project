var Moeda;
var arrayMoedas = [];

// A mesma velocidade horizontal preserva a distancia segura ate a recolha.
function moverMoeda(moeda) {
  if (!moeda.visible) { NovaMoeda(moeda); return; }
  moeda.position.x -= jogo.velocidade * (jogo.passo || 1);
  if (moeda.position.x < carro.position.x - 100) NovaMoeda(moeda);
}

function faixaLivreParaMoeda(x) {
  return !arraySinais.concat(arrayNuvens).some(function (obstaculo) {
    var caixa = new THREE.Box3().setFromObject(obstaculo);
    return x >= caixa.min.x - 70 && x <= caixa.max.x + 70;
  });
}

// Ao reciclar um obstaculo, preserva tambem as moedas que ja estao em jogo.
function afastarObstaculoDasMoedas(obstaculo) {
  arrayMoedas.forEach(function (moeda) {
    if (!moeda.visible) return;
    var caixa = new THREE.Box3().setFromObject(obstaculo);
    if (moeda.position.x >= caixa.min.x - 70 && moeda.position.x <= caixa.max.x + 70) {
      obstaculo.position.x += moeda.position.x + 71 - caixa.min.x;
    }
  });
}

function NovaMoeda(moeda) {
  moeda.visible = false;
  for (var x = 400; x <= 1200; x += 80) {
    if (!faixaLivreParaMoeda(x)) continue;
    // Usa a velocidade maxima para garantir tempo de subida e descida.
    var frames = Math.max(0, (x - carro.position.x - 30) / 4.5);
    var minimo = Math.max(40, carro.position.y - frames * jogo.gravidade + 15);
    var maximo = Math.min(165, carro.position.y + frames * VelocidadeAndar - 15);
    if (minimo > maximo) continue;
    moeda.position.set(x, minimo + Math.random() * (maximo - minimo), 0);
    moeda.visible = true;
    return;
  }
}

function addMoeda() {
  var Geometria_Moeda = new THREE.CylinderGeometry(10,10,1,15);
  var Material_Moeda = new THREE.MeshPhongMaterial({color:0xE6FF40, shading:THREE.FlatShading});

  Moeda = new THREE.Mesh(Geometria_Moeda,Material_Moeda);

  Moeda.rotation.x = Math.PI / 2;
  NovaMoeda(Moeda);
  Moeda.castShadow = true;
  Moeda.receiveShadow = true;

  arrayMoedas.push(Moeda);

  Cena.add(Moeda);
}
