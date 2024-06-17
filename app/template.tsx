'use client'

import { Canvas } from "@react-three/fiber";
import TransitionManager from "./TransitionManager";
import { Stats } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="lg:block hidden">
                <Suspense fallback={<LoadingScreen />}>
                    {/* <EntryScreen /> */}
                    <Canvas camera={{ far: 1111111 }} style={{ position: "fixed", height: "100vh" }} >
                        <TransitionManager>
                            {children}
                        </TransitionManager>
                    </Canvas>
                </Suspense>
            </div>
            <div className="lg:hidden flex justify-center items-center h-screen w-screen animate-[fadeOut_0.5s]">
                Mobile version is currently under development
            </div>
        </>
    )
}

function EntryScreen() {
    const [show, setShow] = useState(true)
    useEffect(() => {
        let timeout = setTimeout(() => setShow(false), 1500)
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    return show && <div className="bg-black fixed w-screen h-screen z-40 flex justify-center items-center">Loading...</div>
}

function LoadingScreen() {
    return (

        <div className="w-screen h-screen flex justify-center items-center z-50">
            <h1>
                Loading...
            </h1>
        </div>

    )
}