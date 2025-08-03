import * as THREE from 'three';

let _scene;
let _voxelSizeX, _voxelSizeY, _voxelSizeZ;
let _geometry, _material;
let _boundingBox;

export function initVoxelGrid(scene, boundingBox, resolution) {
    _scene = scene;
    _boundingBox = boundingBox;

    const size = _boundingBox.getSize(new THREE.Vector3());
    _voxelSizeX = size.x / resolution;
    _voxelSizeY = size.y / resolution;
    _voxelSizeZ = size.z / resolution;

    _geometry = new THREE.BoxGeometry(_voxelSizeX, _voxelSizeY, _voxelSizeZ);
    _material = new THREE.MeshLambertMaterial({ color: 0x55aa55 });
}

export function addVoxelSliceToScene(sliceData, sliceIndex, resolution) {
    for (let i = 0; i < resolution; i++) {
        for (let k = 0; k < resolution; k++) {
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