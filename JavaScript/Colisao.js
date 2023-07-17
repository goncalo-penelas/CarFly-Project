objetosColisao = [];



function distancia(p1, p2) {
  var dx = p1.x - p2.x;
  var dy = p1.y - p2.y;
  var dz = p1.z - p2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function detetarColisao()
{
  var RaioCarro = 10;

  arrayMoedas.forEach(Moeda => {
    var distanciaMoedaCarro = distancia(Moeda.position, carro.position);
    // console.log(distanciaMoedaCarro);
    var RaioMoeda = 10;

    if (distanciaMoedaCarro < RaioCarro + RaioMoeda ) {
      jogo.pontuacao += jogo.valorMoeda;
      NovaMoeda(Moeda);
    }
  });

  // if(StopSinal && carro)
  // {
  //   var matrix = new THREE.Matrix4();
	// 	matrix.extractRotation(StopSinal.matrix);
	// 	var directionFront = new THREE.Vector3(0,0,1);
	// 	directionFront.applyMatrix4(matrix);
	// 	var rayCaster = new THREE.Raycaster(StopSinal.position,directionFront);
	// 	if(rayIntersect(rayCaster,0.1))
	// 	{
	// 		jogo.status = "gameover";
	// 	}

  //   function rayIntersect(ray, distance) {
  //     var intersects = ray.intersectObjects(objetosColisao);
  //     for (var i = 0; i < intersects.length; i++) {
  //       if (intersects[i].distance < distance) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   }
  // }

  arrayParede.forEach(parede => {
     var distanciaSinalCarro = distancia(parede.position, carro.position);
     console.log(distanciaSinalCarro);
     var raioSinal = 13; 
     if (distanciaSinalCarro < RaioCarro + raioSinal) {
       jogo.status = "gameover";
    }
 });

  arrayNuvens.forEach(nuvem => {
    var distanciaNuvemCarro = distancia(nuvem.position, carro.position);

    var RaioNuvem = 10;

    if (distanciaNuvemCarro < RaioCarro + RaioNuvem ) {
      jogo.status = "gameover";
    }
  });



}