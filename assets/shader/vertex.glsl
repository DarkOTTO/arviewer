#version 300 es
uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjMat;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aTexCoord;
layout(location = 2) in vec3 aNormal;

out vec2 vTexCoord;
out vec3 vNormal;
out vec3 vVertex;

vec4 projectPoint(in vec4 point) {
   return uProjMat * point;
}

void main() {
   mat4 normalMat = transpose(inverse(uViewMat * uModelMat));
   vec4 normal = normalMat * vec4(aNormal, 0.0);
   vNormal = normalize(normal.xyz);
   vVertex = (uViewMat * uModelMat * vec4(aPosition, 1.0)).xyz;
   gl_Position = uProjMat * uViewMat * uModelMat * vec4(aPosition, 1.0);
   vTexCoord = aTexCoord;
}

