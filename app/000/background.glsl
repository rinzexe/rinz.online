precision highp float;
precision highp sampler2D;

uniform sampler2D currentPage;
uniform sampler2D loadedPage;

uniform vec2 currentRes;
uniform vec2 loadedRes;

uniform vec2 canvasRes;

uniform vec2 mouse;

uniform float time;
uniform float transition;

varying vec2 vUv;

#pragma glslify: cnoise2 = require(glsl-noise/classic/2d) 

#pragma glslify: calcUv = require(../shaderlib/containImageUv.glsl) 

#pragma glslify: distortion = require(../shaderlib/distortion.glsl) 

#pragma glslify: portalArea = require(../shaderlib/portal.glsl) 
#pragma glslify: portalDistortion = require(../shaderlib/portalDistortion.glsl) 

#pragma glslify: vignette = require(../shaderlib/post-processing/vignette.glsl)
#pragma glslify: adjustContrast = require(../shaderlib/post-processing/adjustContrast.glsl)
#pragma glslify: adjustExposure = require(../shaderlib/post-processing/adjustExposure.glsl)

float portalSize() {
    return pow(clamp(distance(vec2(0.0), mouse) * 0.8, 0.1, 1.0) + 1.05, 11.0);
}

void main() {
    // make sure all textures are same aspect ratio
    vec2 uv = (calcUv(canvasRes, currentRes, vUv) - 0.5) * 2.0;

    vec2 distUv = distortion(uv, time);

    float area = portalArea(distUv, mouse, time, portalSize(), 0.1);

    uv = portalDistortion(distUv, uv, mouse, area, time, 1.5);

    vec3 currentColor = texture2D(currentPage, uv).xyz;
    vec3 loadedColor = texture2D(loadedPage, uv).xyz;

    float sinTransition = abs(sin(transition - floor(transition)));

    float finalTransition = floor(vUv.y + sinTransition + (cnoise2(vec2(round(vUv.x * 120.0) * sin(vUv.x * 10.0), vUv.y)) * (0.5 - abs(sinTransition - 0.5))));

    vec3 color = mix(currentColor, loadedColor, finalTransition);

    color = adjustContrast(color, 1.2);
    color = vignette(color, (uv - 0.5) * 2.0);
    color = adjustExposure(color, -0.8 + (-distance(uv, mouse) * 2.0 - 0.5) * clamp(area, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
}