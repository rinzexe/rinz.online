#pragma glslify: centerNoiseMultiplier = require(../shaderlib/utils/centerNoiseMultiplier.glsl) 

float multipliers(float direction, float multiplier, vec2 point, float time, float amp)
{
    return centerNoiseMultiplier(direction, multiplier, 3.0, point, time, amp * 1.0) * centerNoiseMultiplier(direction, multiplier, 14.0, point, time, amp * 1.0);
}

#pragma glslify: export(multipliers)