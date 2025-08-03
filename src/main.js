import * as THREE from 'three';
import { setupScene, adjustCameraToModel, setDirectionalLightIntensity } from './scene.js';
import { loadModel } from './modelLoader.js';
import { voxelize } from './voxelizer.js';
import { initVoxelGrid, addVoxelSliceToScene, clearVoxelGrid, getVoxelData, getVoxelDimensions } from './grid.js';
import { exportVoxelDataToObj } from './objExporter.js';

const { scene, camera, renderer, controls } = setupScene();
const modelUrl = 'assets/casa_3D_0503220629_texture.glb';
const voxelResolution = 50; // Increased resolution for better detail

loadModel(modelUrl, (model) => {
    // Once the model is loaded, voxelize it.
    const boundingBox = new THREE.Box3().setFromObject(model);
    adjustCameraToModel(camera, boundingBox);
    setDirectionalLightIntensity(0.5);
    initVoxelGrid(scene, boundingBox, voxelResolution, 0x0000ff);

    let currentSliceIndex = 0;
    const totalSlices = voxelResolution;
    let sliceDelay = 200; // Delay between slices in milliseconds

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

document.getElementById('clearSceneButton').addEventListener('click', () => {
    clearVoxelGrid();
});

document.getElementById('saveModelButton').addEventListener('click', () => {
    const voxelData = getVoxelData();
    const voxelDimensions = getVoxelDimensions();
    const objContent = exportVoxelDataToObj(voxelData, voxelDimensions);

    const blob = new Blob([objContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voxel_model.obj';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

const sliceDelaySlider = document.getElementById('sliceDelaySlider');
const sliceDelayValueSpan = document.getElementById('sliceDelayValue');

sliceDelaySlider.addEventListener('input', (event) => {
    sliceDelay = parseInt(event.target.value);
    sliceDelayValueSpan.textContent = `${sliceDelay}ms`;
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
