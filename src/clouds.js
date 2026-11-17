var arrayNuvens = [];
var arrayNuvensDecorativas = [];
var geometriaNuvem, materialNuvem;

function criarNuvem() {
  var nuvem = new THREE.Object3D();
  nuvem.userData.nuvem = true;
  if (!geometriaNuvem) geometriaNuvem = new THREE.SphereGeometry(1, 16, 12);
  if (!materialNuvem) materialNuvem = new THREE.MeshPhongMaterial({ color: 0xffffff });
  [[-15, 0, 0, 12], [0, 5, 0, 16], [15, 0, 0, 12], [0, -4, 6, 12]].forEach(function (parte) {
    var volume = new THREE.Mesh(geometriaNuvem, materialNuvem);
    volume.position.set(parte[0], parte[1], parte[2]);
    volume.scale.setScalar(parte[3]);
    volume.castShadow = true;
    nuvem.add(volume);
  });
  return nuvem;
}

function deslocarNuvem(nuvem) {
  // O mesmo deslocamento por tempo para todas as nuvens.
  nuvem.position.x -= jogo.velocidade * (jogo.passo === undefined ? 1 : jogo.passo);
}

function moverNuvemDecorativa(nuvem) {
  deslocarNuvem(nuvem);
  if (nuvem.position.x < -650) nuvem.position.x += 1800;
}

function moverNuvens(nuvem) {
  deslocarNuvem(nuvem);

}

function addNuvem() {
  // Nuvens laterais: apenas cenario, fora das colisoes e da geracao de obstaculos.
  for (var lado = -1; lado <= 1; lado += 2) {
    for (var j = 0; j < 10; j++) {
      var decorativa = criarNuvem();
      decorativa.position.set(-450 + j * 180 + Math.random() * 80,
        90 + Math.random() * 230, lado * (120 + Math.random() * 240));
      decorativa.scale.setScalar(0.6 + Math.random() * 1.2);
      decorativa.rotation.y = Math.random() * Math.PI * 2;
      arrayNuvensDecorativas.push(decorativa);
      Cena.add(decorativa);
    }
  }
}
