'use client';

import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Texture, Uniform, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";
import FluidSim from "vexel-tools";

var _density: any;
var _velocity: any;
var _pressure: any;

class FluidEffect extends Effect {
  constructor({ density, velocity, pressure }: { density: any, velocity: any, pressure: any }) {
    const uniformMap = new Map<string, Uniform>()
    super('FluidEffect', fluidShader.fragment, {
      uniforms: new Map<string, Uniform>([
        ['density', new Uniform(null)],
        ['velocity', new Uniform(null)],
        ['pressure', new Uniform(null)],
        ['transition', new Uniform(null)],
        ['transitionTex', new Uniform(null)],
        ['activeTex', new Uniform(null)],
        ['mouse', new Uniform(new Vector2(0.0, 0.0))]
      ])
    })
    _density = density;
    _velocity = velocity;
    _pressure = pressure;
  }


  update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime: any) {
    // typescript limitation, ignore these errors for now
    this.uniforms.get('density').value = _density;
    this.uniforms.get('velocity').value = _velocity;
    this.uniforms.get('pressure').value = _pressure;
  }
}

const useMousePosition = () => {
  const [
    mousePosition,
    setMousePosition
  ] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({ x: ev.clientX * window.devicePixelRatio, y: ev.clientY * window.devicePixelRatio });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
};

var settings = {
  simRes: 1 / 1000,
  curl: 0,
  dt: 0.016,
  iterations: 3,
  splatMultiplier: 100,

  densityDissipation: 0.99,
  velocityDissipation: 0.99,
  pressureDissipation: 0.9,
}

interface Splats {
  x: number,
  y: number,
  dx: number,
  dy: number,
  radius: number
}

export function PostProcessing() {
  const [prevMouse, setPrevMouse] = useState({ x: 0, y: 0 });
  const [mouseDelta, setMouseDelta] = useState({ x: 0, y: 0 });

  const mousePos = useMousePosition();

  const width = useThree((state) => state.gl.domElement.width);
  const height = useThree((state) => state.gl.domElement.height);
  const renderer = useThree((state) => state.gl);

  const simManager = useMemo(
    () => new FluidSim(width, height, renderer, settings),
    [width, height, renderer],
  );

  var splats: Splats[] = [{
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    radius: 0.0001
  }]


  const Fluid = forwardRef(({ density, velocity, pressure }: {density: any, velocity: any, pressure: any}, ref) => {
    const effect = useMemo(() => new FluidEffect({ density, velocity, pressure }), [density, velocity, pressure])
    return <primitive ref={ref} object={effect} dispose={null} />
  })
  Fluid.displayName = "Fluid";

  useFrame((state, delta) => {
    setMouseDelta({ x: mousePos.x - prevMouse.x, y: mousePos.y - prevMouse.y });
    var mouseMultiplier = 10;
    splats = [{ x: mousePos.x, y: mousePos.y, dx: mouseDelta.x / mouseMultiplier, dy: mouseDelta.y / mouseMultiplier, radius: 0.0001 }];


    state.gl.autoClear = false;

    simManager.compute(splats);
    state.gl.setRenderTarget(null);

    setPrevMouse(mousePos);
  });

  return (
    <EffectComposer>
      <Fluid density={simManager.densityTexture} velocity={simManager.velocityTexture} pressure={simManager.pressureTexture} />
    </EffectComposer>
  )
}

var fluidShader =
{
  fragment: /* glsl */`

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

    uniform sampler2D density;
    uniform sampler2D velocity;
    uniform sampler2D pressure;

    uniform sampler2D transitionTex;
    uniform sampler2D activeTex;

    uniform float transition;

    uniform vec2 mouse;

    float T_FREQUENCY = 5.0;
    float T_FEATHER = 10.0;

    float minmax(float noiseInput)
    {
      return max(min(noiseInput, 1.0), 0.0);
    }

    float cramp(float value, float amount)
    {
      return minmax((value - 0.5) * amount + 0.5);
    }

    vec4 fluidDistortion(vec2 uv, float targetID)
    {
      vec4 velocityTex = texture2D(velocity, uv);
      vec4 densityTex = texture2D(density, uv);
      vec4 pressureTex = texture2D(pressure, uv);

      float densityFloat = (densityTex.r + densityTex.g + densityTex.b ) / 10.0;

      vec2 uvr = uv + vec2(1.0) * (-vec2(densityTex.r - densityTex.b, densityTex.g - densityTex.a) / 12000.0);
      vec2 uvg = uv + vec2(1.0) * (-vec2(densityTex.r - densityTex.b, densityTex.g - densityTex.a) / 10000.0);
      vec2 uvb = uv + vec2(1.0) * (-vec2(densityTex.r - densityTex.b, densityTex.g - densityTex.a) / 8000.0);

      float r = texture2D(inputBuffer, uvr).r;
      float g = texture2D(inputBuffer, uvg).g;
      float b = texture2D(inputBuffer, uvb).b;

      if (targetID == 1.0)
      {
        r = texture2D(transitionTex, uvr).r;
        g = texture2D(transitionTex, uvg).g;
        b = texture2D(transitionTex, uvb).b;
      }

      return vec4(r, g, b, 1.0);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        vec2 centeredUv = uv * 2.0 - vec2(1.0);

        float transitionValue = distance(mouse, centeredUv) + 1.0  - transition * 1.5;

        float transitionNoise = (snoise(vec3(uv * T_FREQUENCY, 0.0)) / T_FEATHER);

        vec2 transitionUv = cramp(transitionValue + transitionNoise, 10.0) * centeredUv;

        vec2 uncenteredUv = transitionUv * 0.5 + vec2(0.5);

        float bufferID = cramp(transitionValue + transitionNoise, T_FEATHER);

        vec4 fluidDistortionColor = fluidDistortion(mix(uv, uncenteredUv, bufferID), mix(1.0, 0.0, bufferID)); 

        outputColor = fluidDistortionColor;
    }
    `
}