export function exportVoxelDataToObj(voxelData, voxelDimensions) {
    const { voxelSizeX, voxelSizeY, voxelSizeZ, boundingBox } = voxelDimensions;
    const resolution = voxelData.length;

    let objContent = '# Voxel Model Exported from Nanobot Grid\n';
    let vertexCount = 0;

    const vertices = [];
    const faces = [];

    // Iterate through the voxel data to create vertices and faces
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            for (let k = 0; k < resolution; k++) {
                if (voxelData[i][j][k] === 1) {
                    // Calculate the center of the voxel
                    const x = boundingBox.min.x + (i * voxelSizeX) + (voxelSizeX / 2);
                    const y = boundingBox.min.y + (j * voxelSizeY) + (voxelSizeY / 2);
                    const z = boundingBox.min.z + (k * voxelSizeZ) + (voxelSizeZ / 2);

                    // Define the 8 vertices of the cube
                    const halfX = voxelSizeX / 2;
                    const halfY = voxelSizeY / 2;
                    const halfZ = voxelSizeZ / 2;

                    const v = [
                        [x - halfX, y - halfY, z + halfZ], // 0: Front-bottom-left
                        [x + halfX, y - halfY, z + halfZ], // 1: Front-bottom-right
                        [x + halfX, y + halfY, z + halfZ], // 2: Front-top-right
                        [x - halfX, y + halfY, z + halfZ], // 3: Front-top-left
                        [x - halfX, y - halfY, z - halfZ], // 4: Back-bottom-left
                        [x + halfX, y - halfY, z - halfZ], // 5: Back-bottom-right
                        [x + halfX, y + halfY, z - halfZ], // 6: Back-top-right
                        [x - halfX, y + halfY, z - halfZ]  // 7: Back-top-left
                    ];

                    // Add vertices to the list
                    v.forEach(vertex => {
                        vertices.push(`v ${vertex[0].toFixed(6)} ${vertex[1].toFixed(6)} ${vertex[2].toFixed(6)}`);
                    });

                    // Define the 6 faces of the cube (indices are 1-based)
                    // Front face
                    faces.push(`f ${vertexCount + 1} ${vertexCount + 2} ${vertexCount + 3} ${vertexCount + 4}`);
                    // Back face
                    faces.push(`f ${vertexCount + 5} ${vertexCount + 8} ${vertexCount + 7} ${vertexCount + 6}`);
                    // Top face
                    faces.push(`f ${vertexCount + 4} ${vertexCount + 3} ${vertexCount + 7} ${vertexCount + 8}`);
                    // Bottom face
                    faces.push(`f ${vertexCount + 1} ${vertexCount + 5} ${vertexCount + 6} ${vertexCount + 2}`);
                    // Right face
                    faces.push(`f ${vertexCount + 2} ${vertexCount + 6} ${vertexCount + 7} ${vertexCount + 3}`);
                    // Left face
                    faces.push(`f ${vertexCount + 5} ${vertexCount + 1} ${vertexCount + 4} ${vertexCount + 8}`);

                    vertexCount += 8;
                }
            }
        }
    }

    objContent += vertices.join('\n') + '\n';
    objContent += faces.join('\n') + '\n';

    return objContent;
}