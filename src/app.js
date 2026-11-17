// Variaveis de Cena, Luz...

var Cena;
var Camara;
var Renderer;

var controloLuz1 = 1;
var controloLuz2 = 1;
var controloCamera = 1;
// var importer= new THREE.FBXLoader();
var height = window.innerHeight,
  width = window.innerWidth;
var aspect = window.innerWidth / window.innerHeight;

function createCamaras() {
  if (controloCamera == 1) {
    Camara = new THREE.PerspectiveCamera(70, aspect, 0.1, 1000);

    // Primeira pessoa
    Camara.position.x = -300;
    Camara.position.z = 0;
    Camara.position.y = 90;
    Camara.rotation.y = -Math.PI / 2;

    controloCamera = 2;
  } else {
    Camara = new THREE.OrthographicCamera(
      (600 * aspect) / -2,
      (600 * aspect) / 2,
      600 / 2,
      600 / -2,
      0.1,
      3000,
    );
    Camara.position.set(0, 75, 1000);
    // Vista rigorosamente lateral, centrada no planeta.
    Camara.lookAt(new THREE.Vector3(0, 75, 0));
    ajustarJanela();

    controloCamera = 1;
  }
}

function createScene() {
  Cena = new THREE.Scene();
  createCamaras();

  Cena.fog = new THREE.Fog(0xf7d9aa, 500, 3000);

  Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  Renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  Renderer.setSize(width, height);
  Renderer.shadowMap.enabled = true;
  document.body.appendChild(Renderer.domElement);

  createDirectionalLight();
  createAmbientLight();
}

function ajustarJanela() {
  width = Math.max(1, window.innerWidth);
  height = Math.max(1, window.innerHeight);
  aspect = width / height;
  if (Camara) {
    if (Camara.isPerspectiveCamera) Camara.aspect = aspect;
    else {
      // Mantem o carro visivel tambem em janelas estreitas.
      var meiaAltura = Math.max(300, 180 / aspect);
      Camara.left = -meiaAltura * aspect;
      Camara.right = meiaAltura * aspect;
      Camara.top = meiaAltura;
      Camara.bottom = -meiaAltura;
    }
    Camara.updateProjectionMatrix();
  }
  if (Renderer) {
    Renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    Renderer.setSize(width, height);
  }
}
window.addEventListener('resize', ajustarJanela);

function alternarPausa() {
  if (!jogo || !jogo.pronto || (jogo.status !== 'jogar' && jogo.status !== 'pausa')) return;
  jogo.status = jogo.status === 'pausa' ? 'jogar' : 'pausa';
  Posicao_Carro = { x: 0, y: 0 };
  ultimoFrame = undefined;
  var pausa = jogo.status === 'pausa';
  document.getElementById('botaoPausa').textContent = pausa ? 'Continuar' : 'Pausar';
  document.getElementById('botaoPausa').setAttribute('aria-pressed', String(pausa));
  document.getElementById('avisoPausa').hidden = !pausa;
}

// Configuração de luzes

var AmbientLight, DirectionalLight;

function createDirectionalLight() {
  if (controloLuz1 == 1) {
    DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
    DirectionalLight.position.set(100, 150, 150);
    DirectionalLight.castShadow = true;
    DirectionalLight.shadow.camera.left = -700;
    DirectionalLight.shadow.camera.right = 700;
    DirectionalLight.shadow.camera.top = 400;
    DirectionalLight.shadow.camera.bottom = -700;
    DirectionalLight.shadow.camera.near = 1;
    DirectionalLight.shadow.camera.far = 2000;
    DirectionalLight.shadow.mapSize.width = 2048;
    DirectionalLight.shadow.mapSize.height = 2048;

    DirectionalLight.shadow.normalBias = 0.5;
    DirectionalLight.shadow.bias = -0.0001;
    Cena.add(DirectionalLight);
    controloLuz1 = 2;
  } else {
    Cena.remove(DirectionalLight);
    controloLuz1 = 1;
  }
}

function createAmbientLight() {
  if (controloLuz2 == 1) {
    AmbientLight = new THREE.AmbientLight(0xffffff, 0.75);

    Cena.add(AmbientLight);
    controloLuz2 = 2;
  } else {
    Cena.remove(AmbientLight);
    controloLuz2 = 1;
  }
}

//  -------------------------------------------------------------------------- //
//Variáveis de Jogo
var jogo;
var pontuacao;

var VelocidadeAndar = 3;

var estrada;
var planeta;
var Relva, Relva2;

var Posicao_Carro = { x: 0, y: 0 };

function ComecarJogo() {
  jogo = {
    pontuacao: 0,
    valorMoeda: 15,
    valorObstaculo: 10,
    gravidade: 1.8,
    tempo: 0,
    velocidade: 2.5,

    pronto: obstaculosIniciais.length > 0,
    status: "jogar",
  };
}

function addEstrada() {
  estrada = new THREE.Object3D();
  planeta = new THREE.Object3D();
  planeta.position.y = -600;
  estrada.add(planeta);
  // Uma faixa e duas calotes da mesma esfera, com o eixo polar em Z.
  var limiteFaixa = Math.acos(100 / 600);
  var Geometria_Estrada = new THREE.SphereGeometry(
    600, 96, 16, 0, Math.PI * 2, limiteFaixa, Math.PI - 2 * limiteFaixa
  );
  Geometria_Estrada.applyMatrix(
    new THREE.Matrix4().makeRotationX(-Math.PI / 2),
  );
  var Textura_Estrada = new THREE.TextureLoader().load(
    "assets/images/estrada.jpg",
  );
  Textura_Estrada.wrapS = Textura_Estrada.wrapT = THREE.RepeatWrapping;
  Textura_Estrada.repeat.set(15, 1);
  Textura_Estrada.anisotropy = 16;
  Textura_Estrada.encoding = THREE.sRGBEncoding;
  var Material_Estrada = new THREE.MeshPhongMaterial({ map: Textura_Estrada });
  Estrada = new THREE.Mesh(Geometria_Estrada, Material_Estrada);
  Estrada.position.y = 0;
  Estrada.receiveShadow = false;
  planeta.add(Estrada);

  var Geometria_Relva = new THREE.SphereGeometry(600, 96, 48, 0, Math.PI * 2, 0, limiteFaixa);
  Geometria_Relva.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  // Projecao uniforme: evita os aneis escuros criados pelas repeticoes nos paralelos.
  var pontosRelva = Geometria_Relva.attributes.position;
  var uvRelva = Geometria_Relva.attributes.uv;
  for (var i = 0; i < pontosRelva.count; i++) {
    uvRelva.setXY(i, pontosRelva.getX(i) / 120, pontosRelva.getY(i) / 120);
  }
  var Textura_Relva = new THREE.TextureLoader().load("assets/images/relva.jpg");
  Textura_Relva.wrapS = Textura_Relva.wrapT = THREE.MirroredRepeatWrapping;
  Textura_Relva.repeat.set(1, 1);
  Textura_Relva.anisotropy = 1;
  Textura_Relva.encoding = THREE.sRGBEncoding;
  var Material_Relva = new THREE.MeshPhongMaterial({ map: Textura_Relva });
  Relva = new THREE.Mesh(Geometria_Relva, Material_Relva);
  Relva.position.y = 0;
  Relva.position.z = 0;
  Relva.receiveShadow = false;
  planeta.add(Relva);

  Relva2 = Relva.clone();
  Relva2.rotation.y = Math.PI;
  planeta.add(Relva2);

  addSinal();

  Cena.add(estrada);
}

function updateElementos(passo) {
  jogo.tempo += passo / 60;
  jogo.velocidade = Math.min(4.5, 2.5 + jogo.tempo / 60);
  jogo.passo = passo;
  pontuacao = jogo.pontuacao.toString();
  document.getElementById("pontuacao").innerHTML = pontuacao;

  var acelerar = Posicao_Carro.y > 0;
  var velocidadeVertical = acelerar ? VelocidadeAndar : -jogo.gravidade;
  carro.position.y = Math.max(10, Math.min(200, carro.position.y + velocidadeVertical * passo));
  var angulo = acelerar ? 0.14 : -0.10;
  if (carro.position.y === 10 || carro.position.y === 200) angulo = 0;
  carro.rotation.z += (angulo - carro.rotation.z) * (1 - Math.exp(-0.12 * passo));

  //Moeda
  arrayMoedas.forEach(moverMoeda);
  Moeda.rotation.z += 0.06;
  // Outros elementos
  if (intervaloFumo > 0) intervaloFumo--;
  if (Posicao_Carro.y > 0) addFumo();
  arrayFumos.slice().forEach(moverFumo);
  arraySinais.forEach(moverSinal);
  arrayNuvens.forEach(moverNuvens);
  arrayNuvensDecorativas.forEach(moverNuvemDecorativa);
  gerirObstaculos();

  // As tres superficies partilham a mesma origem e uma unica rotacao.
  planeta.rotation.z += jogo.velocidade / 600 * passo;
}

function guardarEstadoInicial(objeto) {
  objeto.userData.inicial = {
    visivel: objeto.visible,
    posicao: objeto.position.clone(),
    rotacao: objeto.rotation.clone(),
    escala: objeto.scale.clone()
  };
}

function reporEstadoInicial(objeto) {
  var inicial = objeto.userData.inicial;
  objeto.visible = inicial.visivel;
  objeto.position.copy(inicial.posicao);
  objeto.rotation.copy(inicial.rotacao);
  objeto.scale.copy(inicial.escala);
}

function ReiniciarJogo() {
  ComecarJogo();
  ultimoFrame = undefined;
  Posicao_Carro = { x: 0, y: 0 };
  reporObstaculosIniciais();
  [carro, Moeda, planeta].concat(arrayNuvensDecorativas).forEach(reporEstadoInicial);
  arrayFumos.slice().forEach(eliminarFumo);
  intervaloFumo = 0;
  document.getElementById('pontuacao').innerHTML = '0';
  document.getElementById('botaoPausa').textContent = 'Pausar';
  document.getElementById('botaoPausa').setAttribute('aria-pressed', 'false');
  document.getElementById('avisoPausa').hidden = true;
  Cena.updateMatrixWorld(true);
}

var ultimoFrame;

function loop(agora) {
  var passo = ultimoFrame === undefined || agora === undefined ? 1 :
    Math.min((agora - ultimoFrame) / (1000 / 60), 2);
  ultimoFrame = agora;
  if (jogo.status == "jogar" && jogo.pronto) {
    updateElementos(passo);
    detetarColisao();
  } else if (jogo.status == "gameover") {
    alert("GameOver");
    ReiniciarJogo();
  }
  Renderer.render(Cena, Camara);
  requestAnimationFrame(loop);
}

function init() {
  document.getElementById("botaoJogar").style.display = "none";
  document.getElementById("logo").style.display = "none";
  document.getElementById("botaoAlterarCamara").style.display = "inline";
  document.getElementById("botaoLuzAmbient").style.display = "inline";
  document.getElementById("botaoLuzDirectional").style.display = "inline";
  document.getElementById("botaoPausa").hidden = false;

  ComecarJogo();
  createScene();
  addCarro();
  addEstrada();
  addNuvem();
  addMoeda();
  [carro, Moeda, planeta].concat(arrayNuvens, arrayNuvensDecorativas)
    .forEach(guardarEstadoInicial);
  document.addEventListener("keydown", handleKeyDown, false);
  document.addEventListener("keyup", handleKeyUp, false);
  document.addEventListener("mousedown", handleMouseDown, false);
  document.addEventListener("mouseup", handleMouseUp, false);

  loop();
}
