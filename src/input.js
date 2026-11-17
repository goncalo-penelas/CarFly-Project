// Os controlos da interface nao fazem o carro acelerar.
function podeAcelerar(ev) {
  return jogo && jogo.pronto && jogo.status === 'jogar' &&
    !(ev.target && ev.target.closest && ev.target.closest('button'));
}

function handleKeyDown(ev) {
  if (ev.keyCode !== 32 || !podeAcelerar(ev)) return;
  if (ev.preventDefault) ev.preventDefault();
  Posicao_Carro.y = VelocidadeAndar;
  addFumo();
}

function handleKeyUp(ev) {
  if (ev.keyCode === 32) Posicao_Carro.y = 0;
}

function handleMouseDown(ev) {
  if (ev.which !== 1 || !podeAcelerar(ev)) return;
  Posicao_Carro.y = VelocidadeAndar;
  addFumo();
}

function handleMouseUp(ev) {
  if (ev.which === 1) Posicao_Carro.y = 0;
}
window.addEventListener('blur', function () {
  Posicao_Carro.y = 0;
  if (jogo && jogo.status === 'jogar') alternarPausa();
});
