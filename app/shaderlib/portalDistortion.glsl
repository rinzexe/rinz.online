#pragma glslify: snoise = require(glsl-noise/simplex/3d) 

vec2 distortion(vec2 uv, vec2 offsetUv, vec2 mouse, float area, float time, float fisheyeForce) {
    return (((uv - 0.5) * 2.0 * (1.0 * mix(1.0, 1.0 - distance(mouse, offsetUv) * fisheyeForce, clamp(area, 0.0, 1.0)))) + 1.0) / 2.0 + (snoise(vec3(uv * 80.0, time / 10.0)) / 9.0) * (area / 11100.0);;
}

#pragma glslify: export(distortion)