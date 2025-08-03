import * as THREE from 'three';
import { setupScene, adjustCameraToModel } from './scene.js';
import { loadModel } from './modelLoader.js';
import { voxelize } from './voxelizer.js';
import { initVoxelGrid, addVoxelSliceToScene } from './grid.js';

const { scene, camera, renderer, controls } = setupScene();
const modelUrl = 'assets/casa_3D_0503220629_texture.glb';
const voxelResolution = 50; // Increased resolution for better detail

loadModel(modelUrl, (model) => {
    // Once the model is loaded, voxelize it.
    const boundingBox = new THREE.Box3().setFromObject(model);
    adjustCameraToModel(camera, boundingBox);
    initVoxelGrid(scene, boundingBox, voxelResolution);

    let currentSliceIndex = 0;
    const totalSlices = voxelResolution;
    const sliceDelay = 200; // Delay between slices in milliseconds

    const progressCallback = (sliceIndex, sliceData) => {
        setTimeout(() => {
            addVoxelSliceToScene(sliceData, sliceIndex, voxelResolution);
            currentSliceIndex++;
            if (currentSliceIndex === totalSlices) {
                console.log("All slices rendered.");
            }
        }, sliceIndex * sliceDelay);
    };

    voxelize(model, voxelResolution, progressCallback);

    // Start the animation loop only after the model is processed.
    animate();
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
