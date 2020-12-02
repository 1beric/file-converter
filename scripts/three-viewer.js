import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

function load_canvas(file, canvas) {

    canvas.height = canvas.width;

    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 1;  // the canvas default
    const near = 0.1;
    const far = 2000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 15);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 10, 0);
    controls.update();

    const scene = new THREE.Scene();

    function addLight(...pos) {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...pos);
        scene.add(light);
    }

    function addAmbient(color) {
        const light = new THREE.AmbientLight(color);
        scene.add(light);
    }


    addAmbient(0x404040);
    addLight(-1, 2, 4);
    addLight(1, 2, -2);


    let fReader = new FileReader();
    fReader.onload = function (e) {
        loadSTL(e.target.result);
        console.log("file loaded");
    }
    fReader.readAsText(file);

    // let loader = new THREE.STLLoader();
    // loader.load(file, (geometry) => {
    //     const material = new THREE.MeshBasicMaterial({ color: 0x808040 });

    //     const mesh = new THREE.Mesh(geometry, material);
    //     scene.add(mesh);
    // });




    function loadSTL(file_data) {
        const geometry = new THREE.Geometry();

        let lines = file_data.split('\n');

        let x = [Infinity, -Infinity];
        let y = [Infinity, -Infinity];
        let z = [Infinity, -Infinity];

        lines.filter((e) => e.startsWith("vertex")).map((e) => {
            return e.split(/\s+/).slice(1).filter((elem) => elem.length != 0).map((elem) => parseFloat(elem) / 100.0);
        }).forEach((e, i) => {
            geometry.vertices.push(new THREE.Vector3(e[0], e[1], e[2]));
            if (i % 3 == 2)
                geometry.faces.push(new THREE.Face3(i - 2, i - 1, i));
            x[0] = Math.min(x[0], e[0]);
            x[1] = Math.max(x[1], e[0]);
            y[0] = Math.min(y[0], e[1]);
            y[1] = Math.max(y[1], e[1]);
            z[0] = Math.min(z[0], e[2]);
            z[1] = Math.max(z[1], e[2]);
        });



        camera.position.set((x[0] + x[1]) / 2.0, (y[0] + y[1]) / 2.0, z[1] + (y[0] + y[1]) / 2.0);
        controls.target.set((x[0] + x[1]) / 2.0, (y[0] + y[1]) / 2.0, (z[0] + z[1]) / 2.0);
        controls.update()


        geometry.computeFaceNormals();

        // center the geometry
        // geometry.translate(canvas.width / -2, 0, canvas.height / -2);

        const material = new THREE.MeshPhongMaterial({ color: 0x808070 });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

export { load_canvas };
