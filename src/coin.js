var Moeda;
var arrayMoedas = [];


function moverMoeda(Moeda)
{
    var final = new THREE.Vector3(-1000, Moeda.position.y, Moeda.position.z);
    var gravi = new THREE.Vector3(Moeda.position.x, -1000, Moeda.position.z);

    Moeda.position.lerp(final, 0.001);
    Moeda.position.lerp(gravi, 0.0001);

    if(Moeda.position.x> carro.position.x + 225){
        Moeda.position.lerp(gravi, -0.00025);
  
      }
    if(Moeda.position.x < carro.position.x - 75){
        Moeda.position.lerp(gravi, 0.00025);
      }
    if(Moeda.position.x < carro.position.x - 400)
    {
        NovaMoeda(Moeda);
    }
}

function NovaMoeda(Moeda)
{
    
    Moeda.position.set(400,Math.random() *(200 -10) + 10, 0);
    const index = arraySinais.indexOf(Moeda);
    if (index > -1) {
        arrayMoedas.splice(index, 1);
    }
}


function addMoeda()
{
var Geometria_Moeda = new THREE.CylinderGeometry(10,10,1,15);
var Material_Moeda = new THREE.MeshPhongMaterial({color:0xE6FF40, shading:THREE.FlatShading});

Moeda = new THREE.Mesh(Geometria_Moeda,Material_Moeda);

Moeda.rotation.x = Math.PI / 2;
Moeda.position.set(400,Math.random() *(200 -10) + 10, 0);
Moeda.castShadow = true;
Moeda.receiveShadow = true;

arrayMoedas.push(Moeda);

Cena.add(Moeda)
}