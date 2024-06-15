'use client';

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Container, FontFamilyProvider, Fullscreen, Text } from "@react-three/uikit";
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stats, useTexture } from '@react-three/drei'
import { useRouter } from "next/navigation";
import { common } from "@/app/styles/styles";
import * as THREE from 'three'
import { TransitionContext } from "../TransitionManager";
import UIkit from "../components/UIKit";
import CameraController from "../components/CameraController";

import backgroundFragment from './background.glsl'
import Background from "../components/Background";

import { pages } from "@/constants/pages";
import { temp } from "three/examples/jsm/nodes/Nodes.js";

function lerp(a: number, b: number, alpha: number) {
    return a + alpha * (b - a)
}

export default function Page() {
    const vw = useThree().size.width;
    const vh = useThree().size.height;

    const enterTextRef = useRef<any>(null)

    var currentWheel = useRef(0)

    var mouseForShader = useRef(new THREE.Vector2(0, 0))

    const context = useContext(TransitionContext)

    var textureData: any = {}

    var tempTextures = []
    var tempResolutions = []
    for (let i = 0; i < pages.length; i++) {
        tempTextures.push(useTexture(pages[i].image))
        tempTextures[i].wrapS = THREE.ClampToEdgeWrapping
        tempTextures[i].wrapT = THREE.ClampToEdgeWrapping
        tempResolutions.push(new THREE.Vector2(tempTextures[i].source.data.width, tempTextures[i].source.data.height))
    }
    textureData = { textures: tempTextures, resolutions: tempResolutions }

    useFrame((state, delta) => {

        var mouseX = lerp(mouseForShader.current.x, state.pointer.x, 0.01)
        var mouseY = lerp(mouseForShader.current.y, state.pointer.y, 0.01)
        mouseForShader.current = new THREE.Vector2(mouseX, mouseY)

        enterTextRef.current!.setStyle({ positionRight: -(mouseForShader.current.x * 0.5 + 0.25) * vw, positionBottom: (mouseForShader.current.y * 0.5) * vh, fontSize: Math.min(Math.max(((1 - mouseForShader.current.distanceTo(new THREE.Vector2(0, 0))) * 400) - 300, 0), 50) })
    })

    const compute = useCallback((element: any, state: any) => {
        element.uniforms.mouse.value = mouseForShader.current

        if (currentWheel.current < Math.round(currentWheel.current)) {
            currentWheel.current = currentWheel.current + 0.01
        }
        if (currentWheel.current > Math.round(currentWheel.current)) {
            currentWheel.current = currentWheel.current - 0.01
        }

        if (Math.abs(currentWheel.current - Math.round(currentWheel.current)) <= 0.011) {
            currentWheel.current = Math.round(currentWheel.current)
        }

        var floor = Math.floor(currentWheel.current);
        var ceil = Math.ceil(currentWheel.current);

        element.uniforms.currentPage.value = textureData.textures[floor]
        element.uniforms.loadedPage.value = textureData.textures[ceil]

        var res = new THREE.Vector2(0.0, 0.0);
        state.gl.getSize(res)


        if (textureData.resolutions[floor]) {
            element.uniforms.currentRes.value = textureData.resolutions[floor]
        }
        element.uniforms.loadedRes.value = textureData.resolutions[ceil]


        element.uniforms.transition.value = currentWheel.current
    }, [mouseForShader, textureData])

    const handleWheel = useCallback((e: any) => {
        currentWheel.current = Math.min(Math.max(currentWheel.current + e.deltaY / 10000, 0), pages.length - 1)
    }, [currentWheel])

    return (
        <>
            <CameraController targetY={0} />
            <UIkit onWheel={handleWheel}>
                <Container flexGrow={1} width={vw} height={vh} backgroundColor="white" flexDirection="column" >
                    <Background compute={compute} source="/images/20.png" fragment={backgroundFragment} uniforms={{ transition: { value: 0 }, mouse: { value: new THREE.Vector2(0, 0) }, loadedPage: { value: null }, currentPage: { value: null }, loadedRes: { value: new THREE.Vector2(0, 0) }, currentRes: { value: new THREE.Vector2(0, 0) } }} props={{ flexGrow: 1, zIndexOffset: -11, positionType: "absolute", width: "100%", height: "100%" }}>
                        <Container />
                    </Background>
                    <Container zIndexOffset={10} width="100%" height="100%" positionType="absolute" >
                        <Container width="100%" height="100%" positionType="absolute" alignItems="center" justifyContent="center">
                            <Text onClick={() => context.link("/002")} ref={enterTextRef} {...common.title}>
                                ENTER
                            </Text>
                            <Container zIndexOffset={1000} width="50%" height="50%"></Container>
                        </Container>
                        <UI currentWheel={currentWheel} />
                    </Container>
                </Container >
            </UIkit>
        </>
    );
}

function UI({ currentWheel }: { currentWheel: React.MutableRefObject<number> }) {
    const [forceRender, setForceRender] = useState(0);
    var previousWheel = useRef(0)

    useFrame(() => {
        // i have no idea what the fuck this is. but it works. god forgive me
        if (currentWheel.current != previousWheel.current && currentWheel.current == Math.round(currentWheel.current)) {
            setForceRender(forceRender + 1)
        }
        previousWheel.current = currentWheel.current
    })

    return (
        <>
            <Container height="100%" positionType="absolute" padding={100} flexDirection="column" justifyContent="flex-end">
                <Text {...common.subtitle}>
                    {"#" + pages[currentWheel.current].id.toString().padStart(3, "0")}
                </Text>

                <Text {...common.title}>
                    {pages[currentWheel.current].title}
                </Text>
                <Text  {...common.p}>
                    {pages[currentWheel.current].subtitle}
                </Text>
            </Container>
            <Container height="100%" positionType="absolute" padding={100} flexDirection="column" justifyContent="center">
                <Text width="35%"  {...common.p}>
                    {pages[currentWheel.current].description}
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
                {pages[currentWheel.current].date}
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
        </>
    )
}