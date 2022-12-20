import jsonData from './poi/poi.json' assert {type: "json"};

var index = 0;
let model;

window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = index + '0';

    model = document.createElement('a-entity');
    initShader();
    document.querySelector('button[data-action="change"]').addEventListener('click', function () {
        getLocation();
        renderPlaces();
    });
};

let objModel = "ballon.obj";

function dropdownFunction() {
    document.getElementById("objs").classList.toggle("show");
};

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-contents");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

window.addEventListener("load", () => {
    var dropBtn = document.getElementById('SelectOBJ');
    var dropDetailsBanner = document.getElementById('banner');
    var dropDetailsBalloon = document.getElementById('balloon');
    var dropDetailsCubeS = document.getElementById('cubeS');
    var dropDetailsCubeM = document.getElementById('cubeM');
    var dropDetailsCubeL = document.getElementById('cubeL');
    const div = document.querySelector('.instructions');
    
    dropBtn.onclick = function() {
//         var myDropdown = document.getElementsByClassName('submenu')[0];
//         myDropdown.classList.toggle('show');
        document.getElementById("objs").classList.toggle("show");
        div.innerText = "SelectOBJ button clicked";
    }
    
    dropDetailsBanner.onclick = () => {
        dropBtn.textContent = dropDetailsBanner.textContent;
        div.innerText = "Banner clicked";
        objModel = "banner_2side.obj";
    }
    dropDetailsBalloon.onclick = () => {
        dropBtn.textContent = dropDetailsBalloon.textContent;
        div.innerText = "Balloon clicked";
        objModel = "balloon.obj";
    }
    dropDetailsCubeS.onclick = () => {
        dropBtn.textContent = dropDetailsCubeS.textContent;
        div.innerText = "Cube S clicked";
        objModel = "cubebox_square.obj";
    }
    dropDetailsCubeM.onclick = () => {
        dropBtn.textContent = dropDetailsCubeM.textContent;
        div.innerText = "Cube M clicked";
        objModel = "cubebox_rectangle.obj";
    }
    dropDetailsCubeL.onclick = () => {
        dropBtn.textContent = dropDetailsCubeL.textContent;
        div.innerText = "Cube L clicked";
        objModel = "cubebox_long.obj";
    }
});

function initShader() {
    AFRAME.registerShader('ccpoi_shader', {
        schema: {
		    uColor: {type: 'vec4', is: 'uniform'},
		    uMap: {type: 'map',   is: 'uniform'},
        },
        
        vertexShader: [
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
            '   vec4 normalVec = normalMat * vec4(normal, 0.0);',
            '   vNormal = normalize(normalVec.xyz);',
            '   vVertex = (modelViewMatrix * vec4(position, 1.0)).xyz;',
            '   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
            '   vTexCoord = uv;',
            '}'
        ].join('\n'),

        fragmentShader: [
            'vec3 light_position = vec3(100.0, 100.0, 100.0);',
            'vec4 light_specular = vec4(1.0, 1.0, 1.0, 1.0);',
            '',
            'in vec2 vTexCoord;',
            'in vec3 vVertex;',
            'in vec3 vNormal;',
            '',
            'uniform sampler2D uMap;',
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
            '   if (vTexCoord.s > 1.0 || vTexCoord.s < 0.0 || vTexCoord.t > 1.0 || vTexCoord.t < 0.0) {',
            '      tColor = uColor;',
            '   } else{',
            '      tColor = texture2D(uMap, vTexCoord);',
		    '   }',
            '   color += (tColor);',
            '   color += (ndotl * tColor);',
            '',
            '   if (rdotv > 0.0) {',
            '      color += (pow(rdotv, 40.0) * light_specular);',
            '   }',
            '   return color;',
            '}',
            '',
            'void main() {',
            '   pc_fragColor = directional_light();',
            '}'
        ].join('\n')
    });
};

let latitude = jsonData.poi[index].poiCoord.lat;
let longitude = jsonData.poi[index].poiCoord.lon;

function getLocation() {
    if (navigator.geolocation) { // GPS를 지원하면
	      navigator.geolocation.getCurrentPosition(function(position) {
// 	          alert('getLocation() current location : ' + position.coords.latitude + ' ' + position.coords.longitude);
		      console.log('getLocation() current location : ' + position.coords.latitude + ' ' + position.coords.longitude);
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
              const div = document.querySelector('.instructions');
              div.innerText = 'current location : ' + latitude + ', ' + longitude;
	      }, function(error) {
	          console.error(error);
	      });
    } else {
    	  alert('GPS를 지원하지 않습니다');
    }
};

function renderPlaces() {
    let scene = document.querySelector('a-scene');
    var entity = document.querySelector('[gps-entity-place]');
    scene.removeChild(model);
    model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
    console.log("gps entity : lat : " + latitude + ", lon : " + longitude);

    let basePath = './assets/ccpoi/';
    let src = basePath + objModel;
    let mtl = basePath + jsonData.poi[index].mtlFile;
    let texture = basePath + jsonData.poi[index].texture;

    model.setAttribute('obj-model', `obj: ${src};`);
    model.setAttribute('material', `shader: ccpoi_shader;`);
    model.setAttribute('material', `uColor: {0, 0, 0, 1};`);
    model.setAttribute('material', `uMap: ${texture};`);
    console.log("obj : " + src + ", texture : " + texture);
    model.setAttribute('scale', '1.2 1.2 1.2');
    model.setAttribute('rotation', '0 0 0');
    model.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 5000');

    model.setAttribute('animation-mixer', '');

    scene.appendChild(model);
};
