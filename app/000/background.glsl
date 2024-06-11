precision highp float;
precision highp sampler2D;

uniform sampler2D tex;

uniform vec2 imageRes;
uniform vec2 canvasRes;

uniform vec2 mouse;

uniform float time;
uniform float transition;

varying vec2 vUv;

#pragma glslify: snoise = require(glsl-noise/simplex/3d) 

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

    float aspect = canvasRes.x / canvasRes.y;

    vec2 offsetUv = (calcUv(canvasRes, imageRes, vUv) - 0.5) * 2.0;

    vec2 uv = distortion(offsetUv, time);

    float area = portalArea(uv, mouse, time, portalSize(), 0.1);

    uv = portalDistortion(uv, offsetUv, mouse, area, time, 1.5);

    vec3 color = texture2D(tex, uv).xyz;

    color = vignette(color, offsetUv);

    color = adjustContrast(color, 1.2);

    color = adjustExposure(color, -0.8);

    color = adjustExposure(color, (- distance(offsetUv, mouse) * 2.0 - 0.5) * clamp(area, -1.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
}