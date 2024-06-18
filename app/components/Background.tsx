import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Container } from '@react-three/uikit';
import { ReactNode, useMemo, useRef } from 'react';
import * as THREE from 'three'

interface BackgroundProps { source: string, fragment: string, uniforms: any, children?: ReactNode, compute: (element: any, state: any) => void, props: any }

export default function Background({ source, fragment, uniforms, compute, children, props }: BackgroundProps) {
    const vw = useThree().size.width;
    const vh = useThree().size.height;

    var texture = useTexture(source)
    var textureResolution = new THREE.Vector2(texture.source.data.width, texture.source.data.height)

    const BackgroundMaterial = useMemo(() => class BackgroundMaterial extends THREE.ShaderMaterial {

        constructor(props: any) {
            super({
                uniforms:
                {
                    canvasRes: { value: new THREE.Vector2(vw, vh) },
                    imageRes: { value: new THREE.Vector2(textureResolution.x, textureResolution.y) },
                    tex: { value: texture },
                    time: { value: 0 },
                    ...uniforms
                },
                fragmentShader: fragment,
                vertexShader: vertex
            })
        }
    }, [])

    const backgroundElement = useRef<any>(0)

    useFrame((state, delta) => {

        if (backgroundElement.current == 0) {
            state.scene.traverse((element) => {
                // this segment is proof that god does not exist
                if (element['material' as keyof typeof element] != undefined) {
                    if (element['material' as keyof typeof element]!.constructor.name == BackgroundMaterial.name) {
                        // can't be fixed apparently, have to use ts ignore in prod
                        var fixedElement = element['material' as keyof typeof element] as BackgroundMaterial

                        backgroundElement.current = fixedElement
                    }
                }
            })
        }
        else {
            var canvasRes = new THREE.Vector2(0.0, 0.0);
            state.gl.getSize(canvasRes)
            compute(backgroundElement.current, state)
            backgroundElement.current.uniforms.canvasRes.value = canvasRes
            backgroundElement.current.uniforms.imageRes.value = textureResolution
            backgroundElement.current.uniforms.time.value = state.clock.elapsedTime
        }
    })

    return (
        <Container panelMaterialClass={BackgroundMaterial} backgroundColor={"white"} {...props}>
            {children}
        </Container>
    )
}

var vertex
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
