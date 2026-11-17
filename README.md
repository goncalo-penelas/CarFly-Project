# CarFly

A small 3D browser game inspired by Flappy Bird. Fly a car above a rotating
planet, collect coins, and avoid stop signs and obstacle clouds.

## Play

Download or clone the project and open **index.html** in a browser with WebGL.
Click **Jogar** to start. No installation, VS Code, or server is needed.
You can also serve the project through any static HTTP/HTTPS server.

| Control | Action |
| --- | --- |
| Hold Space or the left mouse button | Fly upward |
| Release | Descend |
| Pausar / Continuar | Pause or resume |
| Camera button | Switch between rear and side views |
| Light buttons | Toggle ambient and directional lighting |

Collecting a coin adds 15 points; passing a stop sign adds 10. Speed and obstacle
count increase over time, with randomized sizes and spacing that leaves room
to manoeuvre. Side clouds are decorative. A collision ends the round; dismiss
the Game Over message to restart without returning to the menu.

## How it works

Built with **HTML, CSS, and plain JavaScript**, using **Three.js (r129)** for
WebGL rendering, geometry, lighting, and collision volumes. **FBXLoader** loads
the stop model; **fflate** and **zlib.js** are bundled compression libraries.
The animation loop uses `requestAnimationFrame` and adjusts movement to elapsed
time. No framework, external service, or package installation is needed to play.

## Project layout

- `index.html`: page and controls.
- `styles/`: presentation and responsive layout.
- `src/`: scene, planet, game loop, car, input, collisions, and objects.
- `assets/`: textures, stop model, and resources for direct file opening.
- `vendor/`: bundled third-party libraries.
- `tools/`: asset generation script.

Direct file opening uses `assets/embedded.js` to avoid local-file loading
restrictions. HTTP/HTTPS uses the original files. After changing a bundled
texture or the stop model, rebuild the embedded file with Node.js:

```sh
node tools/build-local-assets.cjs
```
