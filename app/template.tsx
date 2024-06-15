'use client'

import { Canvas } from "@react-three/fiber";
import TransitionManager from "./TransitionManager";
import { Stats } from "@react-three/drei";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <Canvas camera={{ far: 1111111 }} style={{ position: "fixed", height: "100vh" }} >
            {/* <OrbitControls /> */}
            <TransitionManager>
                {children}
            </TransitionManager>
            <Stats />
        </Canvas>
    )
}