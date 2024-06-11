#pragma glslify: snoise = require(glsl-noise/simplex/3d) 

vec2 outputUv(vec2 inputUv, float time) {
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

    vec2 offsetUv = inputUv / (1.0 + distance(vec2(0.0), inputUv) / 1.0);

    float baseNoise1 = snoise(vec3(vec2(offsetUv.x * XFREQ1, (offsetUv.y - time * TIMESCALE1)) * FREQ1, time * EVOLUTIONSPEED1)) * AMP1;
    float baseNoise2 = snoise(vec3(vec2(offsetUv.x * XFREQ2, (offsetUv.y - time * TIMESCALE2)) * FREQ2, time * EVOLUTIONSPEED2)) * AMP2;

    float globalNoise = snoise(vec3(vec2(offsetUv.x * XFREQG, (offsetUv.y - time * TIMESCALEG)) * FREQG, time * EVOLUTIONSPEEDG)) * AMPG;

    float combinedNoise = baseNoise1 + baseNoise2;
    float noiseMultiplier = pow(distance(vec2(0.0, 1.0), vec2(0.0, offsetUv.y)), 3.0) / GLOBALDEPTH;
    vec2 noisedUv = offsetUv * (2.0 + (clamp(combinedNoise, 0.0, 1.0) * noiseMultiplier + clamp(globalNoise, 0.0, 1.0)));

    return noisedUv / 2.0 + 0.5;
}

#pragma glslify: export(outputUv)