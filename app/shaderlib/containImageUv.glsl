vec2 calcUv(vec2 canvasRes, vec2 imageRes, vec2 vUv) {
    float canvasAspect = canvasRes.x / canvasRes.y;
    float imageAspect2 = imageRes.x / imageRes.y;

    vec2 scale;
    scale = vec2(imageAspect2 / canvasAspect, 1.0);

    if(canvasAspect > imageAspect2) {
        scale = vec2(1.0, (imageRes.y / imageRes.x) / (canvasRes.y / canvasRes.x));
    }

    return (vUv - 0.5) / scale + 0.5;
}

#pragma glslify: export(calcUv)