#pragma glslify: snoise = require(glsl-noise/simplex/3d) 

float centerNoiseMultiplier(float mouseDirection, float mouseMultiplier, float freq, vec2 mouse, float time, float amp) {
    return (snoise(vec3(mouseDirection * freq, mouse.x * 5.0, mouse.y * 5.0 + time / 5.0)) * amp * mouseMultiplier + 1.0);
}

#pragma glslify: export(centerNoiseMultiplier)