'use client'

import { ReactNode, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { FontFamilyProvider, Fullscreen, Root, Text } from "@react-three/uikit";
import AnimatedCursor from "react-animated-cursor";
import TransitionManager from "./TransitionManager";
import { PostProcessing } from "./PostProcessing";
import { OrbitControls, Stats, Text3D } from "@react-three/drei";
import CameraController from "./components/CameraController";

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <AnimatedCursor
                innerSize={8}
                outerSize={30}
                color='255, 255, 255'
                outerAlpha={0}
                innerScale={2}
                outerScale={2}
                innerStyle={{
                    mixBlendMode: 'difference'
                }}
                outerStyle={{
                    mixBlendMode: 'difference',
                    border: '1px solid rgb(255, 255, 255)'
                }}
            />
            <Canvas style={{ position: "fixed", height: "100vh" }} >
                {/* <OrbitControls /> */}
                <CameraController />
                <TransitionManager>
                    {children}
                </TransitionManager>
                <Stats />
            </Canvas>
        </>
    )
}
