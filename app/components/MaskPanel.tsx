import { RenderTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Container } from "@react-three/uikit";
import { useRef } from "react";
import * as THREE from "three";

class SplashMaterial extends THREE.ShaderMaterial {

    constructor(props: any) {
        super({
            uniforms:
            {
                canvasRes: { value: new THREE.Vector2(0, 0) },
                time: { value: 0 },
                animStartTime: { value: 0 },
                mouse: { value: new THREE.Vector2(0, 0) },
                tex: { value: null },
            },
            fragmentShader: fragmentShader,
            vertexShader: vertexShader
        })
    }
}

export default function MaskPanel({children}: Readonly<{children: React.ReactNode}>)
{
    const renderTextureRef = useRef<any>()

    useFrame((state) => {
        console.log(renderTextureRef.current)
        var canvasRes = new THREE.Vector2(0.0, 0.0);
        state.gl.getSize(canvasRes)
        state.scene.traverse((element) => {
            // this segment is proof that god does not exist
            if (element['material' as keyof typeof element] != undefined) {
                if (element['material' as keyof typeof element]!.constructor.name == SplashMaterial.name) {
                    var fixedElement = element['material' as keyof typeof element] as SplashMaterial
                    fixedElement.uniforms.canvasRes.value = canvasRes
                    fixedElement.uniforms.time.value = state.clock.elapsedTime
                    fixedElement.uniforms.tex.value = renderTextureRef.current
                }
            }
        })
    })
    return(
        <>
        <Container panelMaterialClass={SplashMaterial} positionType="absolute" width="100%" height="100%" backgroundColor="red">

        </Container>
            <RenderTexture ref={renderTextureRef}>
                {children}
            </RenderTexture>
        </>
    )
}

var fragmentShader
    = /* glsl */ `
precision highp float;
precision highp sampler2D;

uniform sampler2D tex;

uniform vec2 imageRes;
uniform vec2 canvasRes;

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

float centerNoiseMultiplier (float mouseDirection, float freq)
{
    return (snoise(vec3(mouseDirection * freq, 5.0, 5.0 + time / 5.0)) * (0.1 - freq / 1000.0) + 1.0);
}

void main () {

    float mouseDirection = atan(vUv.x - (0.5), (vUv.y - (0.5)));
    float mouseArea = (1.0 - minmax(distance(vUv, vec2(0.5)) * centerNoiseMultiplier(mouseDirection, 4.0) * centerNoiseMultiplier(mouseDirection, 9.0) * centerNoiseMultiplier(mouseDirection, 91.0))) * 1000.0;

    vec2 uv = vUv + (snoise(vec3(vUv * 1110.0, time)) / 1.0) * (snoise(vec3(vUv * 80.0, time)) / 1.0) * (mouseArea / 11100.0);

    vec3 color = texture2D(tex, uv).xyz;

    vec3 contrastColor = adjustContrast(color, 1.2);

    vec3 exposureColor = adjustExposure(contrastColor, -0.8);
    exposureColor = adjustExposure(exposureColor, -0.8 * clamp(mouseArea * 100.0, -1.0, 1.0)) * (2.0);

    gl_FragColor = vec4(color, 1.0);
}
`;

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
