// Variaveis de Cena, Luz...

var Cena;
var Camara;
var Renderer;

var controloLuz1 = 1;
var controloLuz2 = 1;
var controloCamera = 1;
var controloMusica = 1;
// var importer= new THREE.FBXLoader();
var height = window.innerHeight - 29,
width = window.innerWidth - 8;
var aspect = window.innerWidth / window.innerHeight;

function createCamaras(){

  if (controloCamera == 1)
  {
    Camara = new THREE.PerspectiveCamera( 70, aspect, 0.1, 1000 );
  
    // Primeira pessoa
    Camara.position.x = -300;
    Camara.position.z = 0;
    Camara.position.y = 90;
    Camara.rotation.y = -Math.PI/2;
  
    controloCamera = 2;
  }else{
    Camara = new THREE.OrthographicCamera(600 * aspect / - 2, 600 * aspect / 2, 600 / 2, 600 / - 2, 0.1, 1000);
    Camara.position.x = 0;
    Camara.position.z = 200;
    Camara.position.y = 75;
  
    controloCamera = 1;
  }
}

function createScene() {

Cena = new THREE.Scene();
createCamaras();

Cena.fog = new THREE.Fog(0xf7d9aa, 0.0000000001);

Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
Renderer.setSize(width, height);
Renderer.shadowMap.enabled = true;
document.body.appendChild(Renderer.domElement);

createDirectionalLight();
createAmbientLight();
Musica();
}


function Musica(){
  var listener = new THREE.AudioListener();
  var sound = new THREE.Audio( listener );
  var audioLoader = new THREE.AudioLoader();

  audioLoader.load( '/Sounds/lon3r-johny-gt3.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.setVolume( 0.5);
    sound.play();
  });
}

// Configuração de luzes

var AmbientLight, DirectionalLight;

function createDirectionalLight() {
  if(controloLuz1 == 1)
  {
    DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
    DirectionalLight.position.set(100, 150, 150);
    DirectionalLight.castShadow = true;
    DirectionalLight.shadow.camera.left = 400;
    DirectionalLight.shadow.camera.right = -400;
    DirectionalLight.shadow.camera.top = 100;
    DirectionalLight.shadow.camera.bottom = -300;
    DirectionalLight.shadow.camera.near = 1;
    DirectionalLight.shadow.camera.far = 1000;
    DirectionalLight.shadow.mapSize.width = 9999;
    DirectionalLight.shadow.mapSize.height = 9999;
    
    Cena.add(DirectionalLight);
    controloLuz1 = 2;
  } else{
    Cena.remove(DirectionalLight);
    controloLuz1 = 1;
  }
}

function createAmbientLight() {
  if(controloLuz2 == 1)
  {
    AmbientLight = new THREE.AmbientLight(0xdc8874, .5);
    
    Cena.add(AmbientLight);
    controloLuz2 = 2;
  } else{
    Cena.remove(AmbientLight);
    controloLuz2 = 1;
  }
}





//  -------------------------------------------------------------------------- //
//Variáveis de Jogo
var jogo;
var pontuacao;

var VelocidadeAndar = 4;

var estrada;
var Relva, Relva2;

var Posicao_Carro = { x: 0, y: 0 };


function ComecarJogo()
{
  jogo = {
    pontuacao:0,
    valorMoeda:15,
    valorObstaculo:10,
    gravidade: 1,


    status: "jogar",
  };
}

function addEstrada(){

  estrada = new THREE.Object3D();
  var posicao = -600;
  var Geometria_Estrada = new THREE.CylinderGeometry(600,600,200,70);
  Geometria_Estrada.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var Textura_Estrada = new THREE.TextureLoader().load('./Images/estrada.jpg');
  Textura_Estrada.wrapS = Textura_Estrada.wrapT = THREE.RepeatWrapping;
  Textura_Estrada.repeat.set( 15, 1);
  Textura_Estrada.anisotropy = 16;
  Textura_Estrada.encoding = THREE.sRGBEncoding;
  var Material_Estrada = new THREE.MeshPhongMaterial( { map: Textura_Estrada } );
  Estrada = new THREE.Mesh(Geometria_Estrada, Material_Estrada);
  Estrada.position.y = posicao;
  Estrada.receiveShadow = true;
  estrada.add(Estrada);

  var Geometria_Relva = new THREE.SphereGeometry(600,800,400,70);
  Geometria_Relva.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var Textura_Relva = new THREE.TextureLoader().load('./Images/relva.jpg');
  Textura_Relva.wrapS = Textura_Relva.wrapT = THREE.RepeatWrapping;
  Textura_Relva.repeat.set( 10, 5);
  Textura_Relva.anisotropy = 1;
  Textura_Relva.encoding = THREE.sRGBEncoding;
  var Material_Relva = new THREE.MeshPhongMaterial( { map: Textura_Relva } );
  Relva = new THREE.Mesh(Geometria_Relva, Material_Relva);
  Relva.position.y = posicao;
  Relva.position.z = 200;
  Relva.receiveShadow = true;
  estrada.add(Relva);

  Relva2 = Relva.clone();
  Relva2.position.z = -Relva.position.z;
  estrada.add(Relva2);
  
  addSinal();

  Cena.add(estrada);
}


function updateElementos()
{
  pontuacao = jogo.pontuacao.toString();
  document.getElementById("pontuacao").innerHTML = pontuacao;

  // Carro
  if(Posicao_Carro){

    if(carro.position.y > 10){
      carro.position.y -= jogo.gravidade;
    }

    if(carro.position.y < 200){
      carro.position.y += Posicao_Carro.y;
    }
  } 

  //Moeda
  arrayMoedas.forEach(moverMoeda);
  Moeda.rotation.z += .06;
  // Outros elementos
  arrayFumos.forEach(moverFumo);
  arraySinais.forEach(moverSinal);
  arrayNuvens.forEach(moverNuvens);

  Estrada.rotation.z += .005;
  Relva.rotation.z += .005;
  Relva2.rotation.z += .005;
}

function loop(){
  if (jogo.status=="jogar")
  {
    updateElementos();
    detetarColisao();
  } else if (jogo.status=="gameover")
  {
    alert('GameOver');
    carro.position.y=100;
    jogo.pontuacao = 0;
    jogo.status = "jogar";

  }
  Renderer.render(Cena, Camara);
  requestAnimationFrame(loop);
}

function init(){

    document.getElementById("botaoJogar").style.display="none";
		document.getElementById("logo").style.display="none";
		document.getElementById("botaoAlterarCamara").style.display="inline";
		document.getElementById("botaoLuzAmbient").style.display="inline";
		document.getElementById("botaoLuzDirectional").style.display="inline";

  ComecarJogo();
  createScene();
  addCarro();
  addMoeda();
  addEstrada();
  addNuvem();
  document.addEventListener('keydown', handleKeyDown, false);
  document.addEventListener('keyup', handleKeyUp, false);
  document.addEventListener('mousedown', handleMouseDown, false);
  document.addEventListener('mouseup', handleMouseUp, false);

  loop();
}
