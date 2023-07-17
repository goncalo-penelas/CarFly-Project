var Traseira;
var carro;

function addCarro(){
    carro = new THREE.Object3D();
    
    // Base
    
    var Geometria_Base = new THREE.BoxGeometry(120,30,55,1,1,1);
    var Material_Base = new THREE.MeshPhongMaterial({color:0x0000ff, shading:THREE.FlatShading});
    var Base = new THREE.Mesh(Geometria_Base, Material_Base);
    Base.castShadow = true;
    Base.receiveShadow = true;
    carro.add(Base);
    
    // Luzes
    
    var Geometria_Luz = new THREE.BoxGeometry(10,10,15,1,1,1);
    var Material_Luz = new THREE.MeshPhongMaterial({color:0xffffff, shading:THREE.FlatShading});
    var LuzD = new THREE.Mesh(Geometria_Luz, Material_Luz);
    LuzD.position.set(55,10,20);
    
    carro.add(LuzD);
    
    var LuzE = LuzD.clone();
    LuzD.position.z = -LuzD.position.z;
    carro.add(LuzE);
    
    // Teto
    
    var Geometria_Teto = new THREE.CylinderGeometry(35, 40, 20, 4)
    var Material_Teto = new THREE.MeshPhongMaterial({color:0x0000ff, shading:THREE.FlatShading});
    var Teto = new THREE.Mesh(Geometria_Teto, Material_Teto);
    Teto.position.set(-10, 25, 0);
    Teto.rotation.y = -0.8;
    
    carro.add(Teto);
    
    // Janela
    var Geometria_Janela = new THREE.BoxGeometry(3,15,50,1,1,1);
    var Material_Janela = new THREE.MeshPhongMaterial({color:0xffffff,transparent:true, opacity:.3, shading:THREE.FlatShading});;
    var Janela = new THREE.Mesh(Geometria_Janela, Material_Janela);
    Teto.add(Janela);
    Janela.position.set(16,25,0);
    Janela.rotation.z = 0.2;
    
    Janela.castShadow = true;
    Janela.receiveShadow = true;
    
    carro.add(Janela);
    
    // Spoiler
    
    var Geometria_Suporte = new THREE.BoxGeometry(10,20,3,1,1,1);
    var Material_Suporte = new THREE.MeshPhongMaterial({color:0x00ff00, shading:THREE.FlatShading});
    var SuporteE = new THREE.Mesh(Geometria_Suporte, Material_Suporte);
    SuporteE.position.set(-60,15,-10);
    SuporteE.castShadow = true;
    SuporteE.receiveShadow = true;
    carro.add(SuporteE);
    
    var SuporteD = SuporteE.clone();
    SuporteD.position.z = -SuporteE.position.z;
    carro.add(SuporteD);
    
    var Geometria_Spoiler = new THREE.BoxGeometry(30,60,3,1,1,1);
    var Material_Spoiler = new THREE.MeshPhongMaterial({color:0x00ff00, shading:THREE.FlatShading});
    var Spoiler = new THREE.Mesh(Geometria_Spoiler, Material_Spoiler);
    Spoiler.rotation.x = Math.PI / 2;
    Spoiler.position.set(-60,25,0);
    Spoiler.castShadow = true;
    Spoiler.receiveShadow = true;
    carro.add(Spoiler);
    
    // Asas
    var Geometria_Asas = new THREE.BoxGeometry(30,5,120,1,1,1);
    var Material_Asas = new THREE.MeshPhongMaterial({color:0x00ff00, shading:THREE.FlatShading});
    var Asas = new THREE.Mesh(Geometria_Asas, Material_Asas);
    Asas.position.set(0,0,0);
    Asas.castShadow = true;
    Asas.receiveShadow = true;
    carro.add(Asas);
    
    
    // RODAS
    var Geometria_Roda = new THREE.TorusGeometry(7,5,10,50);
    var Material_Roda = new THREE.MeshPhongMaterial({color:0x000000, shading:THREE.FlatShading});
    var Roda_FrenteD = new THREE.Mesh(Geometria_Roda,Material_Roda);
    Roda_FrenteD.position.set(40,-17,25);
    
    var Geometria_Jantes = new THREE.CircleGeometry(5,10);
    var Material_Jantes = new THREE.MeshPhongMaterial({color:0xffffff, shading:THREE.FlatShading});
    var Jantes = new THREE.Mesh(Geometria_Jantes,Material_Jantes);
    Roda_FrenteD.add(Jantes);
    Jantes.position.z = 4;
    
    Roda_FrenteD.castShadow = true;
    Roda_FrenteD.receiveShadow = true;
    
    carro.add(Roda_FrenteD);
    
    
    var Roda_FrenteE = Roda_FrenteD.clone();
    Roda_FrenteE.position.z = -Roda_FrenteD.position.z;
    carro.add(Roda_FrenteE);
    
    var Roda_TraseiraD = Roda_FrenteD.clone();
    Roda_FrenteD.position.x = -Roda_FrenteD.position.x;
    carro.add(Roda_TraseiraD);
    
    var Roda_TraseiraE = Roda_FrenteD.clone();
    Roda_TraseiraE.position.z = -Roda_TraseiraD.position.z;
    carro.add(Roda_TraseiraE);
    
    
    carro.castShadow = true;
    carro.receiveShadow = true;
    
    
    // Traseira
    var Geometria_Traseira = new THREE.SphereGeometry(8,30, 30, 0, Math.PI*2,Math.PI*0.5, Math.PI*1);
    var Material_Traseira = new THREE.MeshPhongMaterial({color:0x00ff00, shading:THREE.FlatShading});
    Traseira = new THREE.Mesh(Geometria_Traseira, Material_Traseira);
    Traseira.position.set(-67,0,0);
    Traseira.rotation.z = Math.PI /2;
    Traseira.castShadow = true;
    Traseira.receiveShadow = true;
    carro.add(Traseira);
    
    
    carro.scale.set(.25,.25,.25);
    carro.position.y = 100;
    carro.position.x = -125;
    Cena.add(carro);
    }