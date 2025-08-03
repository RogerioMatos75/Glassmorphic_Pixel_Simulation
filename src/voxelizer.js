import * as THREE from 'three';

/**
 * Voxelizes a given 3D model.
 * @param {THREE.Object3D} model The model to voxelize.
 * @param {number} resolution The resolution of the voxel grid (e.g., 30 for a 30x30x30 grid).
 * @returns {Array<Array<Array<number>>>} A 3D array representing the voxel data (1 for solid, 0 for empty).
 */
export function voxelize(model, resolution, progressCallback) {
    console.log("Starting voxelization...");

    // 1. Get the bounding box of the model to define our space.
    const bbox = new THREE.Box3().setFromObject(model);
    const size = bbox.getSize(new THREE.Vector3());

    // 2. Create the 3D array to store our voxel data.
    const voxelData = Array.from({ length: resolution }, () =>
        Array.from({ length: resolution }, () => Array(resolution).fill(0))
    );

    const raycaster = new THREE.Raycaster();
    const rayOrigin = new THREE.Vector3();
    const direction = new THREE.Vector3();

    // Iterate over each Y-slice (vertical slice) for progressive building
    for (let j = 0; j < resolution; j++) { // j is the Y-axis (vertical)
        for (let i = 0; i < resolution; i++) { // i is the X-axis
            // Cast rays along Z-axis for each (X,Y) column
            rayOrigin.set(
                bbox.min.x + size.x * (i / (resolution - 1)),
                bbox.min.y + size.y * (j / (resolution - 1)),
                bbox.max.z + size.z // Start way outside on the Z axis
            );
            direction.set(0, 0, -1); // And cast towards the negative Z

            raycaster.set(rayOrigin, direction);
            const intersects = raycaster.intersectObject(model, true);

            // Any voxel hit by an even number of faces is inside
            for (let hit of intersects) {
                const voxelX = Math.floor(resolution * (hit.point.x - bbox.min.x) / size.x);
                const voxelY = Math.floor(resolution * (hit.point.y - bbox.min.y) / size.y);
                const voxelZ = Math.floor(resolution * (hit.point.z - bbox.min.z) / size.z);

                const clampedX = Math.max(0, Math.min(voxelX, resolution - 1));
                const clampedY = Math.max(0, Math.min(voxelY, resolution - 1));
                const clampedZ = Math.max(0, Math.min(voxelZ, resolution - 1));

                // Toggle the state of the voxel (from empty to solid and vice-versa)
                // This handles complex shapes with holes correctly.
                for (let k = clampedZ; k >= 0; k--) {
                    voxelData[clampedX][clampedY][k] = 1 - voxelData[clampedX][clampedY][k];
                }
            }
        }
        console.log(`Voxelizing... ${(((j + 1) / resolution) * 100).toFixed(2)}%`);
        if (progressCallback) {
            // Pass the Y-slice data (voxelData[x][j][z])
            // We need to reformat this slice to be 2D (x, z) for the callback
            const currentYSlice = [];
            for(let x_idx = 0; x_idx < resolution; x_idx++) {
                currentYSlice[x_idx] = [];
                for(let z_idx = 0; z_idx < resolution; z_idx++) {
                    currentYSlice[x_idx][z_idx] = voxelData[x_idx][j][z_idx];
                }
            }
            progressCallback(j, currentYSlice);
        }
    }

    console.log("Voxelization complete.");
    return voxelData;
}
