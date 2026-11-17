var arrayFumos = [];
var intervaloFumo = 0;

function moverFumo(fumo) {
  fumo.position.x -= 1.2;
  fumo.position.y += 0.15;
  fumo.scale.multiplyScalar(1.015);
  fumo.material.opacity -= 0.015;
  if (fumo.material.opacity <= 0) eliminarFumo(fumo);
}

function eliminarFumo(fumo) {
  Cena.remove(fumo);
  fumo.geometry.dispose();
  fumo.material.dispose();
  var index = arrayFumos.indexOf(fumo);
  if (index > -1) arrayFumos.splice(index, 1);
}

function addFumo() {
  if (intervaloFumo > 0 || jogo.status != 'jogar') return;
  intervaloFumo = 5;
  var fumo = new THREE.Mesh(
    new THREE.SphereGeometry(1, 8, 6),
    new THREE.MeshPhongMaterial({ color: 0x808080, transparent: true, opacity: 0.6, depthWrite: false })
  );
  // O escape pertence ao carro; as particulas ficam no mundo depois de sair.
  Traseira.getWorldPosition(fumo.position);
  fumo.position.x -= 2;
  fumo.scale.setScalar(0.8 + Math.random() * 0.7);
  Cena.add(fumo);
  arrayFumos.push(fumo);
}
