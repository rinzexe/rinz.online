import { useFrame, useThree } from "@react-three/fiber"

function lerp(a: number, b: number, alpha: number) {
    return a + alpha * (b - a)
}

export default function CameraManager() {
    const vw = useThree().size.width;
    const vh = useThree().size.height;
    const aspect = vw / vh;

    useFrame((state) => {
        var posSens = -0.5
        var rotSens = 0.05

        var posTargetX = lerp(state.camera.position.x, state.pointer.x * aspect * posSens, 0.02);
        var posTargetY = lerp(state.camera.position.y, state.pointer.y * aspect * posSens - window.scrollY / 100, 0.02);

        var rotTargetX = lerp(state.camera.rotation.y, -state.pointer.x * aspect * rotSens, 0.02)
        var rotTargetY = lerp(state.camera.rotation.x, state.pointer.y * aspect * rotSens, 0.02)

        state.camera.position.set(posTargetX, posTargetY, 10);
        state.camera.rotation.set(rotTargetY, rotTargetX, 0);

        state.camera.position.set(0, - window.scrollY / 100, vh / 154);
        state.camera.rotation.set(0, 0, 0);
    })
    return (<></>)
}
