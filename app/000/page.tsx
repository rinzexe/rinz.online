'use client';

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Container, FontFamilyProvider, Fullscreen, Text } from "@react-three/uikit";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stats, useTexture } from '@react-three/drei'
import { useRouter } from "next/navigation";
import { common } from "@/app/styles/styles";
import * as THREE from 'three'
import { TransitionContext } from "../TransitionManager";
import UIkit from "../components/UIKit";
import CameraController from "../components/CameraController";

import backgroundFragment from './background.glsl'
import Background from "../components/Background";

function lerp(a: number, b: number, alpha: number) {
    return a + alpha * (b - a)
}

export default function Page() {
    const vw = useThree().size.width;
    const vh = useThree().size.height;

    const enterTextRef = useRef<any>(null)

    const threeState = useThree()

    var mouseForShader = useMemo(() => new THREE.Vector2(0, 0), [])

    const context = useContext(TransitionContext)

    useFrame((state, delta) => {

        var mouseX = lerp(mouseForShader.x, state.pointer.x, 0.01)
        var mouseY = lerp(mouseForShader.y, state.pointer.y, 0.01)
        mouseForShader = new THREE.Vector2(mouseX, mouseY)

        enterTextRef.current!.setStyle({ positionRight: -(mouseForShader.x * 0.5 + 0.25) * vw, positionBottom: (mouseForShader.y * 0.5) * vh, fontSize: Math.min(Math.max(((1 - mouseForShader.distanceTo(new THREE.Vector2(0, 0))) * 400) - 300, 0), 50) })
    })

    const compute = useCallback((element: any, state: any) => {
        element.uniforms.mouse.value = mouseForShader
    }, [mouseForShader])

    return (
        <>
            <CameraController targetY={0} />
            <UIkit>
                <Container flexGrow={1} width={vw} height={vh} backgroundColor="white" flexDirection="column" >
                    <Background compute={compute} source="/images/20.png" fragment={backgroundFragment} uniforms={{ mouse: { value: new THREE.Vector2(0, 0) } }} props={{ flexGrow: 1 }}>
                        <Container width="100%" height="100%" positionType="absolute" alignItems="center" justifyContent="center">
                            <Text onClick={() => context.link("/002")} ref={enterTextRef} {...common.title}>
                                ENTER
                            </Text>
                            <Container zIndexOffset={1000} width="50%" height="50%"></Container>
                        </Container>
                        <Container height="100%" positionType="absolute" padding={100} flexDirection="column" justifyContent="flex-end">
                            <Text {...common.subtitle}>
                                #002
                            </Text>

                            <Text {...common.title}>
                                Reviews
                            </Text>
                            <Text  {...common.p}>
                                Media I like, ranked
                            </Text>
                        </Container>
                        <Container height="100%" positionType="absolute" padding={100} flexDirection="column" justifyContent="center">
                            <Text width="35%"  {...common.p}>
                                This is a very descriptive description that describes the things that were described in the description
                            </Text>
                        </Container>
                        <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="center" justifyContent="flex-end">
                            <Text {...common.subtitle}>
                                Scroll down
                            </Text>
                        </Container>
                        <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="center" justifyContent="flex-start">
                            <Text {...common.p}>
                                rinz.online
                            </Text>
                        </Container>
                        <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="flex-end" justifyContent="flex-end">
                            <Text {...common.p}>
                                V0.01
                            </Text>
                        </Container>
                        <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
                            <Text {...common.subtitle}>
                                16/06/2004
                            </Text>
                        </Container>
                        <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="row" alignItems="center" justifyContent="flex-end">
                            <Container flexDirection="column">
                                <Text {...common.title}>
                                    -
                                </Text>
                                <Text {...common.title}>
                                    -
                                </Text>
                                <Text  {...common.title}>
                                    -
                                </Text>
                            </Container>
                        </Container>
                    </Background>
                </Container >
            </UIkit>
        </>
    );
}
