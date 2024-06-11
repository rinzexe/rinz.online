import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useState } from "react";

function lerp(a: number, b: number, alpha: number) {
    return a + alpha * (b - a)
}

export default function CameraController({targetY = 0}: {targetY: number}) {
    const vw = useThree().size.width;
    const vh = useThree().size.height;
    const aspect = vw / vh;

    useFrame((state) => {
        var posSens = -0.5
        var rotSens = 0.05

        var posTargetX = lerp(state.camera.position.x, 0, 0.02);
        var posTargetY = lerp(state.camera.position.y, targetY, 0.02);

        var rotTargetX = lerp(state.camera.rotation.y, -state.pointer.x * aspect * rotSens, 0.02)
        var rotTargetY = lerp(state.camera.rotation.x, state.pointer.y * aspect * rotSens, 0.02)

        state.camera.position.set(posTargetX, posTargetY, vh / 154);
        state.camera.rotation.set(rotTargetY, rotTargetX, 0);

        state.camera.rotation.set(0, 0, 0);

    })
    return (<></>)
}
