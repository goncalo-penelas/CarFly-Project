// Planet geometry and textures. Gameplay obstacles remain in sign.js.

var estrada;
var planeta;
var Estrada;
var Relva, Relva2;

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
    recursoJogo("assets/images/estrada.jpg"),
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
  var Textura_Relva = new THREE.TextureLoader().load(recursoJogo("assets/images/relva.jpg"));
  Textura_Relva.wrapS = Textura_Relva.wrapT = THREE.MirroredRepeatWrapping;
  Textura_Relva.repeat.set(12, 6);
  Textura_Relva.anisotropy = Math.min(8, Renderer.capabilities.getMaxAnisotropy());
  Textura_Relva.minFilter = THREE.LinearMipmapLinearFilter;
  Textura_Relva.magFilter = THREE.LinearFilter;
  Textura_Relva.encoding = THREE.sRGBEncoding;
  var Material_Relva = new THREE.MeshPhongMaterial({
    map: Textura_Relva,
    color: 0xe3ead7,
    shininess: 0,
    specular: 0x000000,
    bumpMap: Textura_Relva,
    bumpScale: 0.2,
  });
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
