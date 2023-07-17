var nuvem;
var arrayNuvens = [];


function moverNuvens(nuvem)
{
    var final = new THREE.Vector3(-10000, nuvem.position.y, nuvem.position.z);

    nuvem.position.lerp(final, 0.0001);

    if(nuvem.position.x < carro.position.x - 500)
    {
        eliminarNuvens(nuvem);
    }
}

function eliminarNuvens(nuvem)
{ 
    nuvem.position.x = 500;
    nuvem.position.y = Math.floor(Math.random() * (200 - 120 + 1)) + 120;
    nuvem.position.z = Math.floor(Math.random() * (500 - -500 + 1)) + -500;
    const index = arrayFumos.indexOf(nuvem);
    if (index > -1) {
        arrayNuvens.splice(index, 1);
    }
}

function addNuvem(){
    
    var Geometria_Nuvem = new THREE.TorusKnotGeometry(5, 20, 30, 100, 2, 3);
    var Material_Nuvem = new THREE.MeshPhongMaterial({
      color:0xffffff,
    });
  
    // var nBlocs = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
    for (let i=0; i<30; i++ ){
      nuvem = new THREE.Mesh(Geometria_Nuvem.clone(), Material_Nuvem);
      nuvem.position.x = i*40;
      nuvem.position.y = Math.floor(Math.random() * (300 - 180 + 1)) + 180;
      nuvem.position.z = Math.floor(Math.random() * (500 - -500 + 1)) + -500;
      nuvem.rotation.z = Math.random()*Math.PI*2;
      nuvem.rotation.y = Math.random()*Math.PI*2;
      var s = .1 + Math.random()*.9;
      nuvem.scale.set(s,s,s);
      nuvem.castShadow = true;

      arrayNuvens.push(nuvem);
      Cena.add(nuvem);
    }
  
  }