precision highp float;
precision highp sampler2D;

uniform sampler2D tex;
uniform sampler2D reviewTex;

uniform vec2 imageRes;
uniform vec2 canvasRes;

uniform vec2 mouse;

uniform float time;

varying vec2 vUv;

#pragma glslify: snoise = require(glsl-noise/simplex/3d) 

#pragma glslify: calcUv = require(../shaderlib/containImageUv.glsl) 

#pragma glslify: distortion = require(../shaderlib/distortion.glsl) 

#pragma glslify: portalArea = require(../shaderlib/portal.glsl) 
#pragma glslify: portalDistortion = require(../shaderlib/portalDistortion.glsl) 

#pragma glslify: vignette = require(../shaderlib/post-processing/vignette.glsl)
#pragma glslify: adjustContrast = require(../shaderlib/post-processing/adjustContrast.glsl)
#pragma glslify: adjustExposure = require(../shaderlib/post-processing/adjustExposure.glsl)

void main() {
    vec2 position = vec2(0.4, 0.0);

    float aspect = canvasRes.x / canvasRes.y;

    vec2 offsetUv = (calcUv(canvasRes, imageRes, vUv) - 0.5) * 2.0;

    vec2 uv = distortion(offsetUv, time);

    float area = portalArea(uv, position, time, 2.0, 0.1);

    uv = portalDistortion(uv, offsetUv, position, area, time, 0.1);

    vec3 color = texture2D(tex, uv).xyz;

    vec2 reviewUv = (vUv  * (1.0 * mix(1.0, 1.0 - distance(position.y, pow(offsetUv.y, 2.0)) * 0.1, clamp(area, 0.0, 1.0))));

    vec3 reviewColor = texture2D(reviewTex, reviewUv).xyz * clamp(area, 0.0, 25.0);

    color += reviewColor;

    color = vignette(color, offsetUv);

    color = adjustContrast(color, 1.2);

    color = adjustExposure(color, -0.8);

    color = adjustExposure(color, (-distance(offsetUv, position) * 0.3 - 0.7) * clamp(area, -1.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
}