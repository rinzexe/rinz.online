'use client';

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Container, FontFamilyProvider, Fullscreen, Text } from "@react-three/uikit";
import { createContext, use, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { OrbitControls, RenderTexture, Stats, Text3D, useTexture } from '@react-three/drei'
import { useRouter } from "next/navigation";
import { common } from "@/app/styles/styles";
import * as THREE from 'three'
import { TransitionContext } from "../TransitionManager";
import { gameReviews, movieReviews, reviewCategories, ReviewType, visualNovelReviews } from "@/constants/reviews";
import UIkit from "../components/UIKit";
import CameraController from "../components/CameraController";
import Background from "../components/Background";
import backgroundFragment from './background.glsl'

function lerp(a: number, b: number, alpha: number) {
    return a + alpha * (b - a)
}

export default function Page() {
    const vw = useThree().size.width;
    const vh = useThree().size.height;

    const [activeCategory, setActiveCategory] = useState(0);
    const [targetOffset, setTargetOffset] = useState(0);

    const [currentCategoryTitle, setCurrentCategoryTitle] = useState("Visual Novels");

    const renderTextureRef = useRef<any>()

    function handleWheel(e: WheelEvent) {
        setTargetOffset(Math.max(Math.min(targetOffset + e.deltaY / 100, reviewCategories[activeCategory].reviews.length / 2.5), 0))
    }

    function minMax(input: number) {
        return Math.min(Math.max(input, 0), reviewCategories.length - 1)
    }

    function next() {
        setActiveCategory(minMax(activeCategory + 1))
        setTargetOffset(0)
        setCurrentCategoryTitle(reviewCategories[minMax(activeCategory + 1)].title)
    }

    function previous() {
        setActiveCategory(minMax(activeCategory - 1))
        setTargetOffset(0)
        setCurrentCategoryTitle(reviewCategories[minMax(activeCategory - 1)].title)
    }


    const uniforms = {
        reviewTex: { value: null },
    }



    const compute = useCallback((element: any, state: any) => {
        element.uniforms.reviewTex.value = renderTextureRef.current
    }, [])

    return (
        <>
            <CameraController targetY={0} />
            <UIkit isfullscreen={false} onWheel={handleWheel}>
                <Container flexGrow={1} width={vw} height={vh} backgroundColor="white" flexDirection="column" >
                    <Background props={{ flexDirection: "column", gap: 100, flexGrow: 1 }} uniforms={uniforms} source="/images/19.png" fragment={backgroundFragment} compute={compute}>
                        <UI currentCategoryTitle={currentCategoryTitle} navFunctions={{ next: next, previous: previous }} />
                        <RenderTexture ref={renderTextureRef}>
                            <ReviewComponent activeCategory={activeCategory} targetOffset={targetOffset} />
                        </RenderTexture>
                    </Background>
                </Container >
            </UIkit>
        </>
    );
}

function ReviewComponent({ activeCategory, targetOffset }: { activeCategory: number, targetOffset: number }) {
    const groupRef = useRef<any>()

    useFrame(() => {
        reviewCategories.forEach((category, index) => {
            if (activeCategory == index) {
                const posY = lerp(groupRef.current!.children[index].position.y, targetOffset, 0.02)
                groupRef.current!.children[index].position.y = posY
            }
            else {
                const posY = lerp(groupRef.current!.children[index].position.y, 0, 0.02)
                groupRef.current!.children[index].position.y = posY
            }

            const posX = lerp(groupRef.current!.position.x, -activeCategory * 10, 0.01)
            groupRef.current!.position.x = posX
        })
    })
    return (
        <group ref={groupRef}>
            {reviewCategories.map((category, index) => {
                return (
                    <group key={index} position={[index * 10, 0, 0]}>
                        <Category name={category.title} reviews={category.reviews} />
                    </group>
                )
            })}
        </group>
    )
}

function UI({ navFunctions, currentCategoryTitle }: { navFunctions: { next: () => void, previous: () => void }, currentCategoryTitle: string }) {
    const vw = useThree().size.width;
    const vh = useThree().size.height;

    const threeState = useThree()

    const context = useContext(TransitionContext)

    return (
        <>
            <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="flex-start" justifyContent="flex-end">
                <Text {...common.title}>
                    Reviews
                </Text>
                <Text onClick={() => context.link("/000")} {...common.subtitle}>
                    {"<    Return to 000"}
                </Text>
            </Container>
            <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="flex-end" justifyContent="center">
                <Text width="15%" textAlign={"right"} {...common.p}>
                    {'Reviews are based on my enjoyment consuming the media, not on what I think is objectively good or bad.'}
                </Text>
            </Container>
            <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="row" alignItems="flex-start" justifyContent="flex-start">
                <Text {...common.title}>
                    {currentCategoryTitle}
                </Text>
            </Container>
            <Container width="100%" height="100%" gap={30} positionType="absolute" padding={100} flexDirection="row" alignItems="flex-end" justifyContent="center">
                <Text onClick={() => navFunctions.previous()} {...common.subtitle}>
                    {'< Previous'}
                </Text>
                <Text onClick={() => navFunctions.next()} {...common.subtitle}>
                    {'Next >'}
                </Text>
            </Container>
        </>
    )
}

function Category({ name, reviews }: { name: string, reviews: ReviewType[] }) {
    return (
        <>
            {reviews.map((review, index) => {
                return <Review key={index} id={index} review={review} />
            })}
        </>
    )
}

function Review({ review, id }: { review: ReviewType, id: number }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        const worldPos = new THREE.Vector3()
        groupRef.current!.getWorldPosition(worldPos)
        const rotY = lerp(groupRef.current!.rotation.y, worldPos.y / 5, 0.03)
        groupRef.current!.rotation.y = rotY
        groupRef.current!.position.y = -id / 2

    })
    return (
        <group ref={groupRef}>
            <ReviewText align="left">
                {review.title}
            </ReviewText>
            <ReviewText position={1} align="left">
                {review.overall}
            </ReviewText>
        </group>
    )
}

interface ReviewTextProps {
    children: string,
    align: "left" | "center" | "right",
    position?: number
}

function ReviewText({ children, align, position = 0 }: ReviewTextProps) {
    const vh = useThree().size.height
    const textRef = useRef<THREE.Mesh>(null)
    useFrame((state, delta) => {
        if (align == "left") {
            textRef.current!.position.x = - new THREE.Box3().setFromObject(textRef.current!).getSize(new THREE.Vector3()).x + position + 0.1
        }
    })
    return (
        <Text3D
            ref={textRef}
            position={[0, 0, 1]}
            scale={[1, 1, 0.0001]}
            size={0.2 * (vh / 1600)}
            curveSegments={24}
            lineHeight={0.9}
            letterSpacing={0}
            font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
            {children}
        </Text3D>
    )
}
