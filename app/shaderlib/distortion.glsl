#pragma glslify: cnoise = require(glsl-noise/classic/3d) 

vec2 outputUv(vec2 inputUv, float time) {
    float FREQG = 3.5;
    float XFREQG = 1.0;
    float TIMESCALEG = 0.02;
    float AMPG = 0.5;
    float EVOLUTIONSPEEDG = 0.005;

    float GLOBALDEPTH = 55.0;

    vec2 offsetUv = inputUv / (1.0 + distance(vec2(0.0), inputUv));

    float globalNoise = cnoise(vec3(vec2(offsetUv.x * XFREQG, (offsetUv.y - time * TIMESCALEG)) * FREQG, time * EVOLUTIONSPEEDG)) * AMPG;

    float noiseMultiplier = pow(distance(vec2(0.0, 1.0), vec2(0.0, offsetUv.y)), 3.0) / GLOBALDEPTH;
    vec2 noisedUv = offsetUv * (2.0 + (noiseMultiplier + clamp(globalNoise, 0.0, 1.0)));

    return noisedUv / 2.0 + 0.5;
}

#pragma glslify: export(outputUv)