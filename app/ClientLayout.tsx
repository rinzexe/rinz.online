'use client'

import { ReactNode, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { FontFamilyProvider, Fullscreen, Root, Text } from "@react-three/uikit";
import AnimatedCursor from "react-animated-cursor";
import CameraManager from "./CameraController";
import TransitionManager from "./TransitionManager";
import { PostProcessing } from "./PostProcessing";
import { Stats } from "@react-three/drei";

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
                <CameraManager />
                <CanvasLayout>
                    {children}
                </CanvasLayout>
                <Stats />
            </Canvas>
        </>
    )
}

function CanvasLayout({ children }: { children: ReactNode }) {
    const vw = useThree().size.width
    const vh = useThree().size.height
    return (
        <FontFamilyProvider
            default={{
                light: "/fonts/PPTelegraf-UltraLight-msdf.json",
                medium: "/fonts/PPTelegraf-Regular-msdf.json",
                bold: "/fonts/PPTelegraf-UltraBold-msdf.json",
            }}
        >
            <Root width={vw} height={vh} flexDirection="column">
                <TransitionManager>
                    {children}
                </TransitionManager>
            </Root>
        </FontFamilyProvider>
    )
}