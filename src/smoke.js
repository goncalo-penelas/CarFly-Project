var arrayFumos = [];

function moverFumo(fumo)
{
    var final = new THREE.Vector3(fumo["FinalX"], fumo["FinalY"], fumo.position.z);

    fumo.position.lerp(final, 0.009);
  
    if(fumo.position.x < carro.position.x)
    {
        eliminarFumo(fumo);
    }
}

function eliminarFumo(fumo)
{
    fumo.geometry.dispose();
    fumo.material.dispose();
    Traseira.remove(fumo);

    const index = arrayFumos.indexOf(fumo);
    if (index > -1) {
        arrayFumos.splice(index, 1);
    }
}


function addFumo()
{
    for(let i = 0; i < 10; i++)
    {
        var Geometria_Fumo = new THREE.TorusKnotGeometry(2, 10, 15, 75, 9, 7);
        var Material_Fumo = new THREE.MeshPhongMaterial({color:0x808080,});
        fumo = new THREE.Mesh(Geometria_Fumo,Material_Fumo);
        var escalaRandom = (Math.random() * 1.5);
        fumo.scale.set(escalaRandom,escalaRandom,escalaRandom);

        var tempX, tempY;

        tempX = Math.floor(Math.random() * (carro.position.x - 70 - carro.position.x - 40 + 1)) + carro.position.x - 40;
        tempY = carro.position.y + 30;

        fumo["FinalX"] = tempX;
        fumo["FinalY"] = tempY;


        arrayFumos.push(fumo);
        Traseira.add(fumo);
    }
}