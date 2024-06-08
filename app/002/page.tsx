'use client';

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Container, FontFamilyProvider, Fullscreen, Text } from "@react-three/uikit";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stats, useTexture } from '@react-three/drei'
import { useRouter } from "next/navigation";
import { common } from "@/app/styles/styles";
import * as THREE from 'three'
import { TransitionContext } from "../TransitionManager";

var glsl = require('glslify')

interface ReviewType {
    title: string,
    cover: string,
    overall: string
}

const visualNovelReviews: ReviewType[] = [
    {
        title: "Wonderful Everyday",
        cover: "z",
        overall: "8"
    },
    {
        title: "Song of Saya",
        cover: "z",
        overall: "7"
    },
    {
        title: "Danganronpa 1",
        cover: "z",
        overall: "6"
    },
    {
        title: "Chaos:Head",
        cover: "z",
        overall: "3"
    },
]

const gameReviews: ReviewType[] = [
    {
        title: "Elden Ring",
        cover: "z",
        overall: "8"
    },
    {
        title: "ICO",
        cover: "z",
        overall: "7"
    },
    {
        title: "Yakuza 0",
        cover: "z",
        overall: "6"
    },
]

const movieReviews: ReviewType[] = [
    {
        title: "Seven",
        cover: "z",
        overall: "4"
    },
]

export default function Home() {
    const vw = useThree().size.width;
    const vh = useThree().size.height;

    const threeState = useThree()

    console.log(fragmentShader)

    var texture = useTexture("/000/banner.jpg")
    var textureResolution = new THREE.Vector2(texture.source.data.width, texture.source.data.height)

    class FancyMaterial extends THREE.ShaderMaterial {

        constructor(props: any) {
            super({
                uniforms:
                {
                    canvasRes: { value: new THREE.Vector2(vw, vh) },
                    imageRes: { value: new THREE.Vector2(textureResolution.x, textureResolution.y) },
                    tex: { value: texture },
                    time: { value: threeState.clock.elapsedTime },
                    mouse: { value: new THREE.Vector2(0, 0) },
                    transition: { value: 0 }
                },
                fragmentShader: fragmentShader,
                vertexShader: vertexShader
            })
        }
    }

    const context = useContext(TransitionContext)

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
                }
            }
        })

    })

    return (
        <Container flexGrow={1} width={vw} height={vh} backgroundColor="white" flexDirection="column" >
            <Container backgroundColor="green" flexDirection="column" gap={100} panelMaterialClass={FancyMaterial} flexGrow={1}>
                <Container width="100%" height="100%" positionType="absolute" padding={100} flexDirection="column" alignItems="flex-start" justifyContent="flex-end">
                    <Text {...common.title}>
                        Reviews
                    </Text>
                    <Text onClick={() => context.link("/000")} {...common.p}>
                        {"<    Return to 000"}
                    </Text>
                </Container>
                <Container width="100%" height="100%" flexDirection="column" padding={100} >
                    <Category name="Visual novels" reviews={visualNovelReviews} />
                    <Category name="Games" reviews={gameReviews} />
                    <Category name="Movies" reviews={movieReviews} />
                </Container>
            </Container>
        </Container >
    );
}

function Category({ name, reviews }: { name: string, reviews: ReviewType[] }) {
    return (
        <Container width="100%" flexDirection="column" alignItems="flex-start" justifyContent="flex-start" >
            <Container width="100%" flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
                <Text {...common.title}>
                    {name}
                </Text>
            </Container>
            <Container width="100%" paddingLeft="50%" flexDirection="column" justifyContent="flex-start">
                <Container paddingTop={5} width="100%" justifyContent="space-between" alignItems="center" padding={10}>
                    <Text {...common.p}>
                        Title
                    </Text>
                    <Text {...common.p}>
                        Rating
                    </Text>
                </Container>
                {reviews.map((review, index) => {
                    return <Review key={index} review={review} />
                })}
            </Container>
        </Container>
    )
}

function Review({ review }: { review: ReviewType }) {
    return (
        <Container hover={{ backgroundColor: "white" }} paddingTop={5} width="100%" justifyContent="space-between" alignItems="center" padding={10} borderBottomWidth={1.4}>
            <Text {...common.subtitle}>
                {review.title}
            </Text>
            <Text {...common.subtitle}>
                {review.overall} / 10
            </Text>
        </Container>
    )
}

var fragmentShader
    = glsl(/* glsl */ `
#pragma glslify: noise = require('glsl-noise/simplex/3d')

precision highp float;
precision highp sampler2D;

uniform sampler2D tex;

uniform vec2 imageRes;
uniform vec2 canvasRes;

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

float minmax(float value)
{
    return min(max(value * 1.5, 0.0), 1.0);
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

void main () {

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

// #region transition
    uv = uv * (transition + 1.0);
// #endregion

    vec3 vignette = 1.0 - vec3(pow(distance(vec2(0.0), offsetUv), 0.5));

    vec3 color = texture2D(tex, uv).xyz * vec3(vignette.x * 1.0, vignette.yz);

    vec3 contrastColor = adjustContrast(color, 1.2);
    vec3 exposureColor = adjustExposure(contrastColor, -0.1);

    gl_FragColor = vec4(exposureColor * 0.1, 1.0);
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
