#pragma glslify: centerNoiseMultipliers = require(../shaderlib/portalCenterNoiseMultipliers.glsl) 

// insanely unmanagable piece of garbage please rewrite this later before anyone finds this
float area(vec2 uv, vec2 point, float time, float size, float amp) {
    float direction = atan(uv.x - (point.x / 2.0 + 0.5), (uv.y - (point.y / 2.0 + 0.5)));
    float multiplier = max((1.0 - distance(point, vec2(0.0)) * 2.0), 0.0);
    float noiseMultipliers = centerNoiseMultipliers(direction, multiplier, point, time, amp);
    return (1.0 - clamp(distance(uv, (point / 2.0 + 0.5)) * noiseMultipliers * size, 0.0, 1.0)) * 1000.0 * multiplier;
}

#pragma glslify: export(area)