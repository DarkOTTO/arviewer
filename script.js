import jsonData from './poi/poi.json' assert {type: "json"};

var index = 0;

window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = index + '0';

//    let places = staticLoadPlaces();
//    renderPlaces(places);
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

function staticLoadPlaces() {
    return [
        {
            name: 'Pokèmon',
            location: {
                lat: 37.611956,
                lng: 127.159823,
            },
        },
       {
           name: 'Magnemite',
           location: {
               lat: 37.563676940,
               lng: 126.83037981,
           },
       },
    ];
};

var models = [
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.5 0.5 0.5',
        info: 'Magnemite, Lv. 5, HP 10/10',
        rotation: '0 180 0',
    },
    {
        url: './assets/articuno/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
        url: './assets/dragonite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },
];

var modelIndex = 1;
var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};

function renderPlaces() {
    let scene = document.querySelector('a-scene');
    document.querySelector('button[data-action="change"]').addEventListener('click', function () {
        var entity = document.querySelector('[gps-entity-place]');
        index++;
        var newIndex = index % 2;
        index = newIndex;
//        window.onload();
        renderPlaces();
//        setModel(models[newIndex], entity);
    });

//     places.forEach((place) => {
//         let latitude = place.location.lat;
//         let longitude = place.location.lng;
        let latitude = jsonData.poi[index].poiCoord.lat;
        let longitude = jsonData.poi[index].poiCoord.lon;
        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
	console.log("lat : " + latitude + ", lon : " + longitude);

//        setModel(models[modelIndex], model);
//         let src = './assets/obj/burger.obj';
//         let mtl = './assets/obj/burger.mtl';
//        let texture = './assets/obj/starbucks_cup.jpg';
        let basePath = './assets/ccpoi/';
        let src = basePath + jsonData.poi[index].objFile;
        let mtl = basePath + jsonData.poi[index].mtlFile;
        let texture = basePath + jsonData.poi[index].texture;
//       model.setAttribute('obj-model', `obj: ${src}; mtl: ${mtl};`);
        model.setAttribute('obj-model', `obj: ${src};`);
        model.setAttribute('material', `src: ${texture};`);
	console.log("obj : " + src + ", texture : " + texture);
        model.setAttribute('scale', '1.2 1.2 1.2');
        model.setAttribute('rotation', '0 0 0');
        model.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 5000');

        model.setAttribute('animation-mixer', '');

        scene.appendChild(model);
//     });
};
