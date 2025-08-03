import * as THREE from 'three';

let _scene;
let _voxelSizeX, _voxelSizeY, _voxelSizeZ;
let _geometry, _material;
let _boundingBox;
let _voxelData = []; // Store the full voxel data

export function initVoxelGrid(scene, boundingBox, resolution, voxelColor = 0x55aa55) {
    _scene = scene;
    _boundingBox = boundingBox;

    const size = _boundingBox.getSize(new THREE.Vector3());
    _voxelSizeX = size.x / resolution;
    _voxelSizeY = size.y / resolution;
    _voxelSizeZ = size.z / resolution;

    _geometry = new THREE.BoxGeometry(_voxelSizeX, _voxelSizeY, _voxelSizeZ);
    _material = new THREE.MeshLambertMaterial({ color: voxelColor });

    // Initialize _voxelData with empty arrays
    _voxelData = Array.from({ length: resolution }, () =>
        Array.from({ length: resolution }, () => Array(resolution).fill(0))
    );
}

export function addVoxelSliceToScene(sliceData, sliceIndex, resolution) {
    // Store the slice data in the global _voxelData
    for (let i = 0; i < resolution; i++) {
        for (let k = 0; k < resolution; k++) {
            _voxelData[i][sliceIndex][k] = sliceData[i][k];
            if (sliceData[i][k] === 1) {
                const voxel = new THREE.Mesh(_geometry, _material);
                voxel.position.set(
                    _boundingBox.min.x + (i * _voxelSizeX) + (_voxelSizeX / 2),
                    _boundingBox.min.y + (sliceIndex * _voxelSizeY) + (_voxelSizeY / 2),
                    _boundingBox.min.z + (k * _voxelSizeZ) + (_voxelSizeZ / 2)
                );
                _scene.add(voxel);
            }
        }
    }
}

export function clearVoxelGrid() {
    if (_scene) {
        _scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.material === _material) {
                _scene.remove(child);
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }
    _voxelData = []; // Clear voxel data on scene clear
}

export function getVoxelData() {
    return _voxelData;
}

export function getVoxelDimensions() {
    return { voxelSizeX: _voxelSizeX, voxelSizeY: _voxelSizeY, voxelSizeZ: _voxelSizeZ, boundingBox: _boundingBox };
}