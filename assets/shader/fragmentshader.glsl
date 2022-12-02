version 300 es
precision mediump float;
vec3 light_position = vec3(100.0, 100.0, 100.0);
vec4 light_specular = vec4(1.0, 1.0, 1.0, 1.0);

uniform vec4 material_ambient;
uniform vec4 material_diffuse;
uniform vec4 material_specular;
uniform float material_shininess;

in vec2 vTexCoord;
in vec3 vVertex;
in vec3 vNormal;

out vec4 fragmentColor;

uniform sampler2D uTexture;
uniform vec4 uColor;

vec4 directional_light() {
   vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
   vec3 normal = normalize(vNormal);
   vec3 light_vector = normalize(light_position);
   vec3 reflect_vector = reflect(-light_vector, normal);
   vec3 view_vector = normalize(-vVertex);
   float ndotl = max(0.0, dot(normal, light_vector));
   float rdotv = max(0.0, dot(reflect_vector, view_vector));

   vec4 tColor;
   if (vTexCoord.s > 1.0 || vTexCoord.s < 0.0 || vTexCoord.t > 1.0 || vTexCoord.t < 0.0)
      tColor = vec4(1.0, 1.0, 1.0, 1.0);
   else
      tColor = texture2D(uTexture, vTexCoord);
   color += (material_ambient * tColor);
   color += (ndotl * material_diffuse * tColor);

   if (rdotv > 0.0) {
      color += (pow(rdotv, material_shininess) * light_specular * material_specular);
   }
   return color;
}

void main() {
//   fragmentColor = directional_light();
   fragmentColor = vec4(1, 1, 0, 1);
}
