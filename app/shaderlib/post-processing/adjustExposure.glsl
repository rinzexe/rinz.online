vec3 adjustExposure(vec3 color, float value) {
    return (1.0 + value) * color;
}

#pragma glslify: export(adjustExposure)