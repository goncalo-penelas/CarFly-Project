var StopSinal;
var mixerAnimacao;
var parede;
var arraySinais = [];
var arrayParede = [];


function moverSinal(StopSinal)
{
    var final = new THREE.Vector3(-1000, StopSinal.position.y, StopSinal.position.z);

    var gravi = new THREE.Vector3(StopSinal.position.x, -1000, StopSinal.position.z);


    StopSinal.position.lerp(final, 0.0001);
    StopSinal.position.lerp(gravi, 0.00001);

   if(StopSinal.position.x> carro.position.x + 225){
      StopSinal.position.lerp(gravi, -0.00005);

    }

    if(StopSinal.position.x < carro.position.x - 75){
      StopSinal.position.lerp(gravi, 0.00005);
    }
    if(StopSinal.position.x < carro.position.x - 400)
    {
      jogo.pontuacao += jogo.valorObstaculo;
      NovoSinal(StopSinal);
    }
}

// function moverParede(parede, StopSinal)
// {
//   //   var final = new THREE.Vector3(-1000, parede.position.y, parede.position.z);

//   //   var gravi = new THREE.Vector3(parede.position.x, -1000, parede.position.z);


//   //   parede.position.lerp(final, 0.0001);
//   //   parede.position.lerp(gravi, 0.00001);

//   //  if(parede.position.x> carro.position.x + 225){
//   //     parede.position.lerp(gravi, -0.00005);

//   //   }

//   //   if(parede.position.x < carro.position.x - 75){
//   //     parede.position.lerp(gravi, 0.00005);
//   //   }




//     if(parede.position.x < carro.position.x - 400)
//     {
//       NovoSinal(StopSinal);
//     }
// }

function NovoSinal(StopSinal)
{
  StopSinal.position.set(400,-125, 42);
  var kimpembe = Math.random() * (0.45 - 0.2) + 0.2;
  StopSinal.scale.set(kimpembe, kimpembe, kimpembe);
  StopSinal.position.z= kimpembe*168;
    const index = arraySinais.indexOf(StopSinal);
    if (index > -1) {
        arraySinais.splice(index, 1);
    }
}

function addSinal(){
   parede = new THREE.Object3D();

   var Geometria_Parede = new THREE.SphereGeometry(40, 30, 30);
   var Material_Parede = new THREE.MeshPhongMaterial({color:0x0000ff, shading:THREE.FlatShading});

    var importer1 = new THREE.FBXLoader();
    importer1.load('../Objetos/stopsign.fbx', function(StopSinal){
      mixerAnimacao=new THREE.AnimationMixer(StopSinal);
  
      StopSinal.rotation.y= Math.PI / 2;
      StopSinal.traverse(function(child){
        if(child.isMesh){
          child.castShadow=true;
          child.receiveShadow=true;
        }
      });
      StopSinal.position.set(0,-125, 0);
      for (var i=0; i<40; i++ ){
        StopSinal.position.x = 400 + i*2;
        var kimpembe = Math.random() * (0.45 - 0.2) + 0.2;
        StopSinal.scale.set(kimpembe, kimpembe, kimpembe);
        StopSinal.position.z= kimpembe*168;
        StopSinal.castShadow = true;
        StopSinal.receiveShadow = true;

        for (var l=0; l<4; l++)
        {
          parede = new THREE.Mesh(Geometria_Parede.clone(), Material_Parede);
          parede.position.y = 100 + l*75;
          parede.position.x = 168;

          // parede.visible = false;
          
          StopSinal.add(parede);
          arraySinais.push(parede);
        }
        arraySinais.push(StopSinal);
        estrada.add(StopSinal);
      }

    }, undefined, function ( e ) {
  
      console.error( e );
  
    } );
    
  }

