// Configuração Rato e Teclado


// Espaço
function handleKeyDown(ev) {
    var coords = {
      x:0,
      y:0,
     };
     if(ev.keyCode == 32){
        coords.y += VelocidadeAndar;
        addFumo();
     }
      
  
    Posicao_Carro = coords;
   }

  function handleKeyUp(ev){
     var coords = {
      x:0,
      y:0,
     };
     if(ev.keyCode == 32)
     {
        coords.y = 0;
     }
     Posicao_Carro = coords;
   }
  

// Rato
  function handleMouseDown(ev) {
    var coords = {
      x:0,
      y:0,
     };
     if(ev.which == 1){
        coords.y += VelocidadeAndar;
        addFumo();
     }
    Posicao_Carro = coords;
  }

  function handleMouseUp(ev) {
   var coords = {
     x:0,
     y:0,
    };
    if(ev.which == 1)
    {
       coords.y = 0;
    }
   Posicao_Carro = coords;
 }