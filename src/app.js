// Game state, pause, restart, and animation loop.

var jogo;
var pontuacao;

var VelocidadeAndar = 3;

var Posicao_Carro = { x: 0, y: 0 };

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
