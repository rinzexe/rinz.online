'use client'

import { Canvas } from "@react-three/fiber";
import TransitionManager from "./TransitionManager";
import { Stats } from "@react-three/drei";
import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Canvas camera={{ far: 1111111 }} style={{ position: "fixed", height: "100vh" }} >
                <TransitionManager>
                    {children}
                </TransitionManager>
                <Stats />
            </Canvas>
        </Suspense>
    )
}

function LoadingScreen() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <h1>
                Loading...
            </h1>
        </div>
    )
}