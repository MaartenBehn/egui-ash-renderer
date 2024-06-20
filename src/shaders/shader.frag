#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec4 oColor;
layout(location = 1) in vec2 oUV;

layout(binding = 0, set = 0) uniform sampler2D fontsSampler;

layout(location = 0) out vec4 finalColor;

layout(constant_id = 0) const bool SRGB_FRAMEBUFFER = false;

layout(push_constant) uniform Matrices {
    mat4 ortho;
    uint bgr_format;
} push;

const float GAMMA = 2.2;
const float INV_GAMMA = 1.0 / GAMMA;

vec3 LINEARtoSRGB(vec3 color) {
    return pow(color, vec3(INV_GAMMA));
}
vec4 LINEARtoSRGB(vec4 color) {
    return vec4(LINEARtoSRGB(color.rgb), color.a);
}
void main() {
    vec4 color;
    if (SRGB_FRAMEBUFFER) {
        color = oColor * texture(fontsSampler, oUV);
    } else {
        color = LINEARtoSRGB(oColor * texture(fontsSampler, oUV));
    }

    if (push.bgr_format == 1) {
        finalColor = color.zyxw;
    } else {
        finalColor = color;
    }
}
