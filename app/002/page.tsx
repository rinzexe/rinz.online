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
import MaskPanel from "../components/MaskPanel";

var glsl = require('glslify')

function lerp(a: number, b: number, alpha: number) {
    return a + alpha * (b - a)
}

export default function Page() {
    const vw = useThree().size.width;
    const vh = useThree().size.height;

    const [activeCategory, setActiveCategory] = useState(0);
    const [targetOffset, setTargetOffset] = useState(0);

    const [currentCategoryTitle, setCurrentCategoryTitle] = useState("Visual Novels");

    const groupRef = useRef<THREE.Group>(null)
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

    var texture = useTexture("/images/19.png")
    var textureResolution = new THREE.Vector2(texture.source.data.width, texture.source.data.height)

    class FancyMaterial extends THREE.ShaderMaterial {

        constructor(props: any) {
            super({
                uniforms:
                {
                    canvasRes: { value: new THREE.Vector2(vw, vh) },
                    imageRes: { value: new THREE.Vector2(textureResolution.x, textureResolution.y) },
                    tex: { value: texture },
                    reviewTex: { value: null },
                    time: { value: 0 },
                    mouse: { value: new THREE.Vector2(0, 0) },
                    transition: { value: 0 }
                },
                fragmentShader: fragmentShader,
                vertexShader: vertexShader
            })
        }
    }

    useFrame((state, delta) => {

        var canvasRes = new THREE.Vector2(0.0, 0.0);
        state.gl.getSize(canvasRes)
        state.scene.traverse((element) => {
            // this segment is proof that god does not exist
            if (element['material' as keyof typeof element] != undefined) {
                if (element['material' as keyof typeof element]!.constructor.name == FancyMaterial.name) {
                    var fixedElement = element['material' as keyof typeof element] as FancyMaterial
                    fixedElement.uniforms.canvasRes.value = canvasRes
                    fixedElement.uniforms.imageRes.value = textureResolution
                    fixedElement.uniforms.time.value = state.clock.elapsedTime
                    fixedElement.uniforms.reviewTex.value = renderTextureRef.current
                }
            }
        })
    })

    return (
        <>
            <CameraController />
            <UIkit onWheel={handleWheel}>
                <Container flexGrow={1} width={vw} height={vh} backgroundColor="white" flexDirection="column" >
                    <Container backgroundColor="green" flexDirection="column" gap={100} panelMaterialClass={FancyMaterial} flexGrow={1}>
                        <UI currentCategoryTitle={currentCategoryTitle} navFunctions={{ next: next, previous: previous }} />
                        <RenderTexture ref={renderTextureRef}>
                            <ReviewComponent activeCategory={activeCategory} targetOffset={targetOffset} />
                        </RenderTexture>
                    </Container>
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
            size={0.2}
            curveSegments={24}
            lineHeight={0.9}
            letterSpacing={0}
            font={'/fonts/PPTelegraf-Regular-TypeFace.json'}>
            {children}
        </Text3D>
    )
}

var reviewFrag
    = glsl(/* glsl */ `

precision highp float;
precision highp sampler2D;

uniform vec2 imageRes;
uniform vec2 canvasRes;

uniform vec2 mouse;

uniform float time;

varying vec2 vUv;

//#region noise
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
       return mod289(((x*34.0)+10.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v)
    { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
  
  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
  
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
  
  // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
  
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
  
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
  
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
  
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
  
  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
  
  // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
    }
  //#endregion

// #region never fucking open this section again
vec2 calcUv()
{
  float canvasAspect = canvasRes.x / canvasRes.y;
  float imageAspect2 = imageRes.x / imageRes.y;
  
  vec2 scale;
  scale = vec2(imageAspect2 / canvasAspect, 1.0);

  if (canvasAspect > imageAspect2)
  {
    scale = vec2(1.0, (imageRes.y / imageRes.x) / (canvasRes.y / canvasRes.x));
  }
      
  return (vUv - 0.5) / scale + 0.5;

}

// #endregion


void main () {
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
    if (abs((mouse.y / 2.0 + 0.5) - (gl_FragCoord.y / canvasRes.y)) < (1.0 - abs(vUv.y - 0.5) * 2.0) / 25.0)
    {
        float intensity = max(1.0 - distance((mouse / 2.0 + 0.5), (gl_FragCoord.xy / canvasRes)) * 5.0, 0.0) / 20.0;
        color = vec4(1.0, 1.0, 1.0, 0.03 + intensity);
    }

    gl_FragColor = color;
}
`);

var fragmentShader
    = glsl(/* glsl */ `
#pragma glslify: noise = require('glsl-noise/simplex/3d')

precision highp float;
precision highp sampler2D;

uniform sampler2D tex;
uniform sampler2D reviewTex;

uniform vec2 imageRes;
uniform vec2 canvasRes;

uniform vec2 mouse;

uniform float time;
uniform float transition;

varying vec2 vUv;

//#region noise shit
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
       return mod289(((x*34.0)+10.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v)
    { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
  
  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
  
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
  
  // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
  
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
  
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
  
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
  
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
  
  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
  
  // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
    }
  //#endregion

// #region never fucking open this section again
vec2 calcUv()
{
  float canvasAspect = canvasRes.x / canvasRes.y;
  float imageAspect2 = imageRes.x / imageRes.y;
  
  vec2 scale;
  scale = vec2(imageAspect2 / canvasAspect, 1.0);

  if (canvasAspect > imageAspect2)
  {
    scale = vec2(1.0, (imageRes.y / imageRes.x) / (canvasRes.y / canvasRes.x));
  }
      
  return (vUv - 0.5) / scale + 0.5;

}

// #endregion

// #region cc
vec3 adjustContrast(vec3 color, float value) {
    return 0.5 + value * (color - 0.5);
  }

  vec3 adjustBrightness(vec3 color, float value) {
    return color + value;
  }

  vec3 adjustExposure(vec3 color, float value) {
    return (1.0 + value) * color;
  }

  vec3 adjustSaturation(vec3 color, float value) {
    const vec3 luminosityFactor = vec3(0.2126, 0.7152, 0.0722);
    vec3 grayscale = vec3(dot(color, luminosityFactor));
  
    return mix(grayscale, color, 1.0 + value);
  }
  // #endregion

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float minmax(float value)
{
    return min(max(value, 0.0), 1.0);
}

float FREQ1 = 2.0;
float XFREQ1 = 5.0;
float TIMESCALE1 = 0.01;
float AMP1 = 2.0;
float EVOLUTIONSPEED1 = 0.01;

float FREQ2 = 411.0;
float XFREQ2 = 1.0;
float TIMESCALE2 = 0.02;
float AMP2 = 0.1;
float EVOLUTIONSPEED2 = 0.05;

float FREQG = 2.5;
float XFREQG = 1.0;
float TIMESCALEG = 0.02;
float AMPG = 0.1;
float EVOLUTIONSPEEDG = 0.005;

float GLOBALDEPTH = 55.0;

float centerNoiseMultiplier (float mouseDirection, float mouseMultiplier, float freq)
{
    return (snoise(vec3(mouseDirection * freq, mouse.x * 5.0, mouse.y * 5.0 + time / 5.0)) * (0.1 - freq / 1000.0)  * mouseMultiplier + 1.0);
}

void main () {

    float aspect = canvasRes.x / canvasRes.y;

    vec2 offsetUv = (calcUv() - 0.5) * 2.0;

    offsetUv = offsetUv / (1.0 + distance(vec2(0.0), offsetUv) / 1.0);

// #region distortion
    float baseNoise1 = snoise(vec3(vec2(offsetUv.x * XFREQ1, (offsetUv.y - time * TIMESCALE1)) * FREQ1, time * EVOLUTIONSPEED1)) * AMP1;
    float baseNoise2 = snoise(vec3(vec2(offsetUv.x * XFREQ2, (offsetUv.y - time * TIMESCALE2)) * FREQ2, time * EVOLUTIONSPEED2)) * AMP2;

    float globalNoise = snoise(vec3(vec2(offsetUv.x * XFREQG, (offsetUv.y - time * TIMESCALEG)) * FREQG, time * EVOLUTIONSPEEDG)) * AMPG;

    float combinedNoise = baseNoise1 + baseNoise2;
    float noiseMultiplier = pow(distance(vec2(0.0, 1.0), vec2(0.0, offsetUv.y)), 3.0) / GLOBALDEPTH;
    vec2 noisedUv = offsetUv * (2.0 + (minmax(combinedNoise) * noiseMultiplier + minmax(globalNoise)));

    vec2 uv = noisedUv / 2.0 + 0.5;

// #endregion

    float mouseDirection = atan(uv.x - (mouse.x / 2.0 + 0.5), (uv.y - (mouse.y / 2.0 + 0.5)));
    float mouseMultiplier = max((1.0 - distance(mouse, vec2(0.0)) * 2.0), 0.0);
    float mouseArea = (1.0 - minmax(distance(uv, (mouse / 2.0 + 0.5)) * centerNoiseMultiplier(mouseDirection, mouseMultiplier, 4.0) * centerNoiseMultiplier(mouseDirection, mouseMultiplier, 9.0) * centerNoiseMultiplier(mouseDirection, mouseMultiplier, 91.0) * (1.2 + (pow(clamp(distance(vec2(0.0), mouse) * 0.8, 0.1, 1.0) + 1.0, 8.0))))) * 1000.0 * mouseMultiplier;

    uv = uv + (snoise(vec3(uv * 1110.0, time)) / 1.0) * (snoise(vec3(uv * 80.0, time)) / 1.0) * (mouseArea / 11100.0);

    vec3 vignette = 1.0 - vec3(pow(distance(vec2(0.0), offsetUv), 0.5));

    vec3 color = texture2D(tex, uv).xyz * vec3(vignette.x * 1.0, vignette.yz);

    vec2 reviewUv = vUv + (0.0 - (snoise(vec3(vUv * 8810.0, time / 1.0)) * snoise(vec3(vUv * 10.0, time / 10.0)) * pow(distance(vec2(0.5), vUv), 2.0)) / 5.0);

    vec3 reviewColor = texture2D(reviewTex, reviewUv).xyz * (mouseArea);

    color += reviewColor;

    vec3 contrastColor = adjustContrast(color, 1.2);

    vec3 exposureColor = adjustExposure(contrastColor, -0.8);
    exposureColor = adjustExposure(exposureColor, -0.8 * clamp(mouseArea * 100.0, -1.0, 1.0) * (distance((mouse / 2.0 + 0.5), uv) + 0.95)) * ((distance((mouse), vec2(0.0)) + 1.0) / 2.0);


    gl_FragColor = vec4(exposureColor, 1.0);
}
`);

var vertexShader
    = /* glsl */ `

precision highp float;
precision highp sampler2D;
#include <common>
varying vec2 vUv;

void main() {
    #include <uv_vertex>
    gl_Position =  projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4( position * 1.2, 1.0 );
}
`;
