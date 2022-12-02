import jsonData from './poi/poi.json' assert {type: "json"};

var index = 0;

window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = index + '2';

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

    const uniforms = {
        uModelMat: {type: 'mat4', is: 'uniform'},
        uViewMat: {type: 'mat4', is: 'uniform'},
        uProjMat: {type: 'mat4', is: 'uniform'},
        uTexture: {type: 'sampler2D', is: 'uniform'},
        uColor: {type: 'vec4', is: 'uniform'},
        material_ambient: {type: 'vec4', is: 'uniform'},
        material_diffuse: {type: 'vec4', is: 'uniform'},
        material_specular: {type: 'vec4', is: 'uniform'},
        material_shininess: {type: 'number', is: 'uniform'}
    }

    AFRAME.registerShader('custom_shader', {
    	  schema: {
		        uModelMat: {type: 'mat4', is: 'uniform'},
		        uViewMat: {type: 'mat4', is: 'uniform'},
		        uProjMat: {type: 'mat4', is: 'uniform'},
		        uTexture: {type: 'sampler2D', is: 'uniform'},
		        uColor: {type: 'vec4', is: 'uniform'},
		        material_ambient: {type: 'vec4', is: 'uniform'},
		        material_diffuse: {type: 'vec4', is: 'uniform'},
		        material_specular: {type: 'vec4', is: 'uniform'},
		        material_shininess: {type: 'number', is: 'uniform'}
    	  },
        vertexShader: require('./assets/shader/vertex.glsl'),
        fragmentShader: require('./assets/shader/fragment.glsl'),
    });
//       model.setAttribute('obj-model', `obj: ${src}; mtl: ${mtl};`);
    model.setAttribute('obj-model', `obj: ${src};`);
    model.setAttribute('material', `src: ${texture};`);
    console.log("obj : " + src + ", texture : " + texture);
    model.setAttribute('scale', '1.2 1.2 1.2');
    model.setAttribute('rotation', '0 0 0');
    model.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 5000');

    model.setAttribute('animation-mixer', '');

    scene.appendChild(model);
};
