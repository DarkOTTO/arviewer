import jsonData from './poi/poi.json' assert {type: "json"};

var index = 1;

window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = index + '1';

    renderPlaces();

    getLocation();
};

function getLocation() {
    if (navigator.geolocation) { // GPS를 지원하면
	      navigator.geolocation.getCurrentPosition(function(position) {
// 	          alert('getLocation() : ' + position.coords.latitude + ' ' + position.coords.longitude);
	          return position.coords;
	      }, function(error) {
	          console.error(error);
	      });
    } else {
    	  alert('GPS를 지원하지 않습니다');
    }
}

function renderPlaces() {
    let scene = document.querySelector('a-scene');
    document.querySelector('button[data-action="change"]').addEventListener('click', function () {
        var entity = document.querySelector('[gps-entity-place]');
        index++;
        var newIndex = index % 2;
        index = newIndex;
        renderPlaces();
    });

    let latitude = jsonData.poi[index].poiCoord.lat;
    let longitude = jsonData.poi[index].poiCoord.lon;
    let model = document.createElement('a-entity');
    model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
    console.log("lat : " + latitude + ", lon : " + longitude);

//         let src = './assets/obj/burger.obj';
//         let mtl = './assets/obj/burger.mtl';
//        let texture = './assets/obj/starbucks_cup.jpg';
    let basePath = './assets/ccpoi/';
    let src = basePath + jsonData.poi[index].objFile;
    let mtl = basePath + jsonData.poi[index].mtlFile;
    let texture = basePath + jsonData.poi[index].texture;

    AFRAME.registerShader('ccpoi_shader', {
    	  schema: {
		        uColor: {type: 'vec4', is: 'uniform'},
		        src: {type: 'map',   is: 'uniform'},
		        material_ambient: {type: 'vec4', is: 'uniform'},
		        material_diffuse: {type: 'vec4', is: 'uniform'},
		        material_specular: {type: 'vec4', is: 'uniform'},
		        material_shininess: {type: 'number', is: 'uniform'}
    	  },
        vertexShader: [
//            '#version 300 es',
//            'uniform mat4 modelViewMatrix;',
//            'uniform mat4 projectionMatrix;',
            '',
            'layout(location = 0) in vec3 aPosition;',
            'layout(location = 1) in vec2 aTexCoord;',
            'layout(location = 2) in vec3 aNormal;',
            '',
            'out vec2 vTexCoord;',
            'out vec3 vNormal;',
            'out vec3 vVertex;',
            '',
            'vec4 projectPoint(in vec4 point) {',
            '   return projectionMatrix * point;',
            '}',
            '',
            'void main() {',
            '   mat4 normalMat = transpose(inverse(modelViewMatrix));',
            '   vec4 normal = normalMat * vec4(aNormal, 0.0);',
            '   vNormal = normalize(normal.xyz);',
            '   vVertex = (modelViewMatrix * vec4(aPosition, 1.0)).xyz;',
            '   gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);',
            '   vTexCoord = aTexCoord;',
            '}'
        ].join('\n'),
        fragmentShader: [
//            'version 300 es',
//            'precision mediump float;',
            'vec3 light_position = vec3(100.0, 100.0, 100.0);',
            'vec4 light_specular = vec4(1.0, 1.0, 1.0, 1.0);',
            '',
            'uniform vec4 material_ambient;',
            'uniform vec4 material_diffuse;',
            'uniform vec4 material_specular;',
            'uniform float material_shininess;',
            '',
            'in vec2 vTexCoord;',
            'in vec3 vVertex;',
            'in vec3 vNormal;',
            '',
//            'out vec4 fragmentColor;',
            '',
            'uniform sampler2D map;',
            'uniform vec4 uColor;',
            '',
            'vec4 directional_light() {',
            '   vec4 color = vec4(0.0, 0.0, 0.0, 0.0);',
            '   vec3 normal = normalize(vNormal);',
            '   vec3 light_vector = normalize(light_position);',
            '   vec3 reflect_vector = reflect(-light_vector, normal);',
            '   vec3 view_vector = normalize(-vVertex);',
            '   float ndotl = max(0.0, dot(normal, light_vector));',
            '   float rdotv = max(0.0, dot(reflect_vector, view_vector));',
            '',
            '   vec4 tColor;',
            '   if (vTexCoord.s > 1.0 || vTexCoord.s < 0.0 || vTexCoord.t > 1.0 || vTexCoord.t < 0.0)',
            '      tColor = vec4(1.0, 1.0, 1.0, 1.0);',
            '   else',
            '      tColor = texture2D(map, vTexCoord);',
            '   color += (material_ambient * tColor);',
            '   color += (ndotl * material_diffuse * tColor);',
            '',
            '   if (rdotv > 0.0) {',
            '      color += (pow(rdotv, material_shininess) * light_specular * material_specular);',
            '   }',
            '   return color;',
            '}',
            '',
            'void main() {',
//            '   pc_fragColor = directional_light();',
            '   pc_fragColor = vec4(1, 1, 0, 1);',
            '}'
        ].join('\n')
    });
//    model.setAttribute('obj-model', `obj: ${src}; mtl: ${mtl};`);
    model.setAttribute('obj-model', `obj: ${src};`);
    model.setAttribute('material', `shader: ccpoi_shader; uTexture: ${texture};`);
//     model.setAttribute('material', `src: ${texture};`);
    console.log("obj : " + src + ", texture : " + texture);
    model.setAttribute('scale', '1.2 1.2 1.2');
    model.setAttribute('rotation', '0 0 0');
    model.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 5000');

    model.setAttribute('animation-mixer', '');

    scene.appendChild(model);
};
