import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(url, onLoad) {
    const loader = new GLTFLoader();

    loader.load(
        url,
        function (gltf) {
            const model = gltf.scene;
            onLoad(model);
        },
        undefined,
        function (error) {
            console.error('An error happened while loading the model:', error);
        }
    );
}
