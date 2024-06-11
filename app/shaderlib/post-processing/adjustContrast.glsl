vec3 adjustContrast(vec3 color, float value) {
    return 0.5 + value * (color - 0.5);
}

#pragma glslify: export(adjustContrast)