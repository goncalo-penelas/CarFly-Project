// Variaveis de Cena, Luz...

var Cena;
var Camara;
var Renderer;

var controloLuz1 = 1;
var controloLuz2 = 1;
var controloCamera = 1;
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
