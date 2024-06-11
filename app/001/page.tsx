'use client'

import { useFrame, useThree } from "@react-three/fiber";
import { Container, Text } from "@react-three/uikit";
import { common } from "../styles/styles";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useRef, useState } from "react";
import { TransitionContext } from "../TransitionManager";
import UIkit from "../components/UIKit";
import Background from "../components/Background";
import backgroundFragment from './background.glsl'
import * as THREE from 'three'
import { RenderTexture, Text3D } from "@react-three/drei";
import CameraController from "../components/CameraController";

export default function Page() {

  const vw = useThree().size.width;
  const vh = useThree().size.height;

  const renderTextureRef = useRef<any>()

  const [targetY, setTargetY] = useState(0)

  const context = useContext(TransitionContext)

  const compute = useCallback((element: any, state: any) => {
    element.uniforms.reviewTex.value = renderTextureRef.current
  }, [])


  function handleWheel(e: any) {
    setTargetY(Math.min(targetY - e.deltaY * 0.01, 0))
  }

  return (
    <UIkit>
      <CameraController targetY={targetY} />
      <Container flexDirection={"column"} onWheel={handleWheel} >
        <Container flexGrow={1} width={vw} height={vh} backgroundColor="black" flexDirection="column">
          <Background props={{ flexDirection: "column", gap: 100, flexGrow: 1 }} uniforms={{ reviewTex: { value: null } }} source="/images/22.png" fragment={backgroundFragment} compute={compute}>
            <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="flex-start" justifyContent="flex-end">
              <Text {...common.title}>
                Portfolio
              </Text>
              <Text onClick={() => context.link("/000")} {...common.subtitle}>
                {"<    Return to 000"}
              </Text>
            </Container>
            <RenderTexture ref={renderTextureRef}>
              <Text3D
                position={[0, 500, -1111]}
                scale={[1, 1, 0.0001]}
                size={50}
                curveSegments={24}
                lineHeight={0.9}
                letterSpacing={0}
                font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
                {"Things I'm working on >_<"}
              </Text3D>
              <Text3D
                position={[0, 400, -1111]}
                scale={[1, 1, 0.0001]}
                size={20}
                curveSegments={24}
                lineHeight={0.9}
                letterSpacing={0}
                font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
                {"Most projects are either dropped\nor not in a presentable form.\n"}
              </Text3D>
              <Text3D
                position={[0, 211, -1111]}
                scale={[1, 1, 0.0001]}
                size={44}
                curveSegments={24}
                lineHeight={0.9}
                letterSpacing={0}
                font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
                {"SpireUI"}
              </Text3D>
              <Text3D
                position={[0, 171, -1111]}
                scale={[1, 1, 0.0001]}
                size={15}
                curveSegments={24}
                lineHeight={0.9}
                letterSpacing={0}
                font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
                {"React component library.\nFull of eye catching, unique\ninteractive components.\nMade with customizability\nin mind."}
              </Text3D>
              <Text3D
                position={[333, 211, -1111]}
                scale={[1, 1, 0.0001]}
                size={44}
                curveSegments={24}
                lineHeight={0.9}
                letterSpacing={0}
                font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
                {"rinz.online"}
              </Text3D>
              <Text3D
                position={[333, 171, -1111]}
                scale={[1, 1, 0.0001]}
                size={15}
                curveSegments={24}
                lineHeight={0.9}
                letterSpacing={0}
                font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
                {"Alot of time and effort\nwent into this website.\nAlthough not super happy with\nhow it turned out, I'm still\nfairly proud of it"}
              </Text3D>
              <Text3D
                position={[0, -20, -1111]}
                scale={[1, 1, 0.0001]}
                size={33}
                curveSegments={24}
                lineHeight={0.9}
                letterSpacing={0}
                font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
                {"Scroll down to read more"}
              </Text3D>
            </RenderTexture>
          </Background>
        </Container>
        <Container width={vw} height={vh} padding={100} flexDirection="column" alignItems="flex-end" justifyContent="flex-end">
        </Container>
      </Container>
    </UIkit>
  )
}
