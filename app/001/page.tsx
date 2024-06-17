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
import { time } from "console";

function lerp(a: number, b: number, alpha: number) {
  return a + alpha * (b - a)
}

export default function Page() {

  const vw = useThree().size.width;
  const vh = useThree().size.height;

  const renderTextureRef = useRef<any>()

  const [targetY, setTargetY] = useState(0)

  const context = useContext(TransitionContext)

  const compute = useCallback((element: any, state: any) => {
    element.uniforms.reviewTex.value = renderTextureRef.current
    state.camera.position.z = vh / 154
    state.camera.position.y = lerp(state.camera.position.y, targetY, 0.02);
  }, [targetY, renderTextureRef])


  function handleWheel(e: any) {
    setTargetY(Math.max(Math.min(targetY - e.deltaY * 0.01, 0), -24))
  }

  return (
    <>
      <UIkit>
        <Container flexDirection={"column"} onWheel={handleWheel} >
          <Container flexGrow={1} width={vw} height={vh} backgroundColor="black" flexDirection="column">
            <Background props={{ flexDirection: "column", gap: 100, flexGrow: 1 }} uniforms={{ reviewTex: { value: null } }} source="/images/20.png" fragment={backgroundFragment} compute={compute}>
              <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="flex-start" justifyContent="flex-end">
                <Text {...common.title}>
                  Portfolio
                </Text>
                <Text onClick={() => context.link("/000")} {...common.subtitle}>
                  {"<    Return to 000"}
                </Text>
              </Container>
              <Text margin={40} onClick={() => location.href = "https://spireui.com"} {...common.subtitle}>
                Visit SpireUI
              </Text>
              <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="flex-start" justifyContent="center">
                <Container width={10} backgroundColor="white" height="20%" >
                  <Container width="100%" height="100%" padding={3} backgroundColor="black">
                    <Container width="100%" height={`${Math.abs(targetY * 4.16)}%`} padding={1} backgroundColor="white">
                    </Container>
                  </Container>
                </Container>
              </Container>
            </Background>
          </Container>
        </Container>
      </UIkit>
      <RenderTexture ref={renderTextureRef}>
        <UIkit isfullscreen={false}>
          <Container width={vw} justifyContent="flex-end" flexDirection="row">
            <Container width="80%" marginTop={300} gap={30} justifyContent="flex-start" alignItems="center" flexDirection="column">
              <Hello />
              <TimeLine />
              <Skills />
              <Projects />
            </Container>
          </Container>
        </UIkit>
      </RenderTexture>
    </>
  )
}

function Hello() {
  const vh = useThree().size.height;
  return (
    <Container height="65%" width="50%" justifyContent="center" flexDirection="column">
      <Text marginLeft={20} {...common.title}>
        Hey !
      </Text>
      <Text {...common.p}>
        I'm a 19-year-old from Espoo, Finland, with experience in various fields, now concentrating on web development. I am driven, ambitious, and deeply passionate, always striving to push my limits. My diverse background allows me to offer unique perspectives and leverage my cross-disciplinary knowledge to create exceptional products and ideas. Currently, I am working on two (soon to be three (hopefully)) main projects. Scroll down to read more about them. I am always open to new opportunities, so feel free to reach out to me via email at roberts.denisovs@gmail.com.
      </Text>
    </Container>
  )
}

function Skills() {
  return (
    <Container width="60%" height={700} flexDirection="column">

      <Container width="100%" flexDirection="row" alignItems="center" justifyContent="center" gap={50}>
        <SkillPill title="javascript" amount="90%" />
        <SkillPill title="Java" amount="30%" />
        <SkillPill title="C#" amount="60%" />
        <SkillPill title=".NET" amount="20%" />
        <SkillPill title="typescript" amount="80%" />
        <SkillPill title="React" amount="80%" />
        <SkillPill title="Next.js" amount="70%" />
        <SkillPill title="php" amount="20%" />
        <SkillPill title="GLSL" amount="90%" />
      </Container>

      <Container marginTop={30} width="100%" flexDirection="row" alignItems="center" justifyContent="center" gap={50}>
        <SkillPill title="Blender" amount="50%" />
        <SkillPill title="Unity" amount="70%" />
        <SkillPill title="Figma" amount="60%" />
        <SkillPill title="Framer" amount="30%" />
        <SkillPill title="Photoshop" amount="50%" />
        <SkillPill title="After Effects" amount="90%" />
      </Container>

      <Container marginTop={30} width="100%" flexDirection="row" alignItems="center" justifyContent="center" gap={50}>
        <SkillPill title="three.js" amount="80%" />
        <SkillPill title="Framer Motion" amount="40%" />
      </Container>
    </Container>
  )
}

const timelineText = [
  "Touched my first programming language. Learned Unity & C#",
  "Widened my programming understanding, did some Python, and .NET development. Mainly worked on overlay plugins for games",
  "Continued the C# grind",
  "Did alot of arts. Mainly video editing. Learned blender, and composition basics. Also made a few Minecraft plugins with Java",
  "Started taking life more seriously. Started learning web development. Sold and developed Shopify themes for streetwear brands. Learned the basics of php and react",
  "Started learning next.js, did a few cancelled electron projects, and started working on a react component library. Also started working on this website.",
]

function TimeLine() {
  return (
    <Container width="55%" paddingTop="10%" gap={50} height={800} flexDirection="row" alignItems="center" justifyContent="flex-start">
      <Container flexDirection="column" height="90%" justifyContent="space-between" alignItems={"center"}>
        {Array.from({ length: 5 }).map((_, index) => {
          return (
            <Container key={index} width="100%" flexDirection="column" justifyContent={"space-evenly"} alignItems="center">
              <Text textAlign={"center"} {...common.subtitle}>
                {(2019 + index).toString()}
              </Text>
              <Container width={2} height="50%" backgroundColor="white" />
            </Container>
          )
        })}
        <Text textAlign={"center"} {...common.subtitle}>
          2024
        </Text>
      </Container>

      <Container flexDirection="column" height="100%" justifyContent="space-between" alignItems={"flex-start"}>
        {Array.from({ length: 6 }).map((_, index) => {
          return (
            <Container height="16%">
              <Text textAlign={"left"} {...common.p}>
                {timelineText[index]}
              </Text>
            </Container>
          )
        })}
      </Container>
    </Container>
  )
}

function SkillPill({ title, amount }: { title: string, amount: any }) {
  return (
    <Container flexDirection="column" alignItems="center" gap={10}>
      <Container width={10} height={150} padding={1} flexDirection="column" alignItems="center" backgroundColor="white" justifyContent="flex-start">
        <Container width="100%" height="100%" padding={2} flexDirection="column" alignItems="center" backgroundColor="black" justifyContent="flex-end">
          <Container width="100%" height={amount} flexDirection="column" alignItems="center" backgroundColor="white" justifyContent="flex-start">
          </Container>
        </Container>
      </Container>
      <Text {...common.subtitle}>
        {title}
      </Text>
    </Container>
  )
}

function Projects() {
  return (
    <Container flexDirection="column" width="50%" height="100%" alignItems="center" gap={50}>
      <Project
        title="rinz.online"
        subtitle="This website"
        description={"Inspired by some of the visual novels that I read, I created this website to be a somewhat fair representation of my latest skills I've obtained. Although it's far from perfect in its current state, I am pretty proud with what I've done up until this point. Utilizing poimandres' libraries I was able to contruct a somewhat performant, and visually unique website using only a single <canvas> component. There are some glaring issues though, some of which are: MSDF text not being crisp and having artifacts, performance on certain devices, design direction inconsistencies, and the lack of a proper mobile experience. I plan to fix these issues in the future."}
      />
      <Project
        title="SpireUI"
        subtitle="An avant-garde React component library"
        description="I started SpireUI after realizing how many developers miss out on the power of three.js. I wanted to make it easier for developers to create beautiful 3D experiences. SpireUI is a React component library that allows you to create 3D experiences with ease. It's still in development, but you can check out the progress on the github page."
      />
    </Container>
  )
}

function Project({ title, subtitle, description }: { title: string, subtitle: string, description: string }) {
  return (
    <Container flexDirection="column" alignItems="center" gap={10}>
      <Text {...common.title}>
        {title}
      </Text>
      <Text {...common.subtitle}>
        {subtitle}
      </Text>
      <Container width="90%">
        <Text {...common.p}>
          {description}
        </Text>
      </Container>
    </Container>
  )
}