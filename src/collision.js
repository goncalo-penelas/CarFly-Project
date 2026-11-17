function distancia(p1, p2) {
  return p1.distanceTo(p2);
}

// Compara cada malha visivel: o poste e a placa nao formam uma caixa unica.
function colideComObstaculo(obstaculo, caixasCarro) {
  if (!obstaculo.visible) return false;
  var colisao = false;
  obstaculo.updateWorldMatrix(true, true);
  obstaculo.traverse(function (parte) {
    if (!parte.isMesh || !parte.visible || colisao) return;
    if (obstaculo.userData.nuvem) {
      if (!parte.geometry.boundingSphere) parte.geometry.computeBoundingSphere();
      var esfera = parte.geometry.boundingSphere.clone().applyMatrix4(parte.matrixWorld);
      colisao = caixasCarro.some(function (caixaCarro) {
        return caixaCarro.intersectsSphere(esfera);
      });
      return;
    }
    if (!parte.geometry.boundingBox) parte.geometry.computeBoundingBox();
    var caixa = parte.geometry.boundingBox.clone().applyMatrix4(parte.matrixWorld);
    colisao = caixasCarro.some(function (caixaCarro) {
      return caixaCarro.intersectsBox(caixa);
    });
  });
  return colisao;
}

function detetarColisao() {
  arrayMoedas.forEach(function (moeda) {
    if (moeda.visible && distancia(moeda.position, carro.position) < 20) {
      jogo.pontuacao += jogo.valorMoeda;
      NovaMoeda(moeda);
    }
  });

  carro.updateWorldMatrix(true, true);
  var caixasCarro = [];
  carro.traverse(function (parte) {
    if (!parte.isMesh || !parte.visible) return;
    if (!parte.geometry.boundingBox) parte.geometry.computeBoundingBox();
    caixasCarro.push(parte.geometry.boundingBox.clone().applyMatrix4(parte.matrixWorld));
  });
  if (arraySinais.concat(arrayNuvens).some(function (obstaculo) {
    return colideComObstaculo(obstaculo, caixasCarro);
  })) jogo.status = 'gameover';
}
