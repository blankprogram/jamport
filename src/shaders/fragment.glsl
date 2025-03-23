#version 300 es

precision mediump float;

uniform float uFrequency;
uniform float uTime;
uniform float uSpeed;
uniform float uValue;
uniform float uInvert;
uniform int uNoiseType;
uniform bool uChromatic;
uniform bool uRainbow;

in vec2 vUv;
out vec4 fragColor;

#include "lygia/generative/cnoise.glsl"
#include "lygia/generative/worley.glsl"
#include "lygia/generative/fbm.glsl"
#include "lygia/generative/voronoi.glsl"
#include "lygia/generative/curl.glsl"
#include "lygia/generative/gerstnerWave.glsl"



float hueAt(vec2 uv) {
    vec3 pos = vec3(uv, uTime * uSpeed);
    if (uNoiseType == 0) return abs(cnoise(pos));
    if (uNoiseType == 1) return worley(pos);
    if (uNoiseType == 2) return fbm(pos);
    if (uNoiseType == 3) return voronoi(pos).x;
    if (uNoiseType == 4) return length(curl(pos) * 0.5 + 0.5);
    if (uNoiseType == 5) {
        vec3 normal;
        vec3 wave = vec3(0.0);
        wave += gerstnerWave(uv + uTime * uSpeed, vec2(1.0, 0.5), 2.0, 2.0, uTime, normal);
        wave += gerstnerWave(uv + uTime * uSpeed, vec2(0.5, 1), 0.25, 0.25, uTime, normal);
            float detail = fbm(vec3(uv * 1.5, uTime * 0.5));
return mix(wave.y * 0.25 + 0.5, detail, 0.2);
    }
    return 0.0;
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 uv = vUv * uFrequency;
    float hue = hueAt(uv);
    float brightness = hue * uValue;
    float final = mix(brightness, 1.0 - brightness, uInvert);

    float offset = 0.1;

    if (uChromatic && uRainbow) {
        vec3 r = hsv2rgb(vec3(hueAt(uv + vec2(offset, 0.0)), 1.0, uValue));
        vec3 g = hsv2rgb(vec3(hueAt(uv), 1.0, uValue));
        vec3 b = hsv2rgb(vec3(hueAt(uv - vec2(offset, 0.0)), 1.0, uValue));
        fragColor = vec4(
            mix(r.r, 1.0 - r.r, uInvert),
            mix(g.g, 1.0 - g.g, uInvert),
            mix(b.b, 1.0 - b.b, uInvert),
            1.0
        );
    } else if (uChromatic) {
        float r = hueAt(uv + vec2(offset, 0.0)) * uValue;
        float g = hueAt(uv) * uValue;
        float b = hueAt(uv - vec2(offset, 0.0)) * uValue;
        fragColor = vec4(
            mix(r, 1.0 - r, uInvert),
            mix(g, 1.0 - g, uInvert),
            mix(b, 1.0 - b, uInvert),
            1.0
        );
    } else if (uRainbow) {
        vec3 rgb = hsv2rgb(vec3(hue, 1.0, uValue));
        fragColor = vec4(
            mix(rgb, vec3(1.0) - rgb, uInvert),
            1.0
        );
    } else {
        fragColor = vec4(vec3(final), 1.0);
    }
}
