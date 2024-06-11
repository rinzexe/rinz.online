vec3 vignette(vec3 color, vec2 uv)
{
    vec3 vignette = 1.0 - vec3(pow(distance(vec2(0.0), uv), 1.5));

    return color * vec3(vignette.x * 1.0, vignette.yz);
}


#pragma glslify: export(vignette)