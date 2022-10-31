window.onload = () => {
    let places = staticLoadPlaces();
    renderPlaces(places);
};

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
            name: 'Starbucks",
            location: {
                lat: 37.563674655,
                lng: 126.83035718,
            },
        },
    ];
}

var models = [
    {
        url: './assets/magnemite/scene.gltf',
//         scale: '0.5 0.5 0.5',
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

var modelIndex = 0;
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

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

        if (place.name.localeCompare("Starbucks") == 0) {
//            model.setAttribute('scale', '0.5 0.5 0.5');
//           model.setAttribute('rotation', '0 180 0');
           model.setAttribute('gltf-model', './assets/magnemite/scene.gltf');
        } else {
//           setModel(models[modelIndex], model);
           model.setAttribute('scale', '0.1 0.1 0.1');
           model.setAttribute('rotation', '0 180 0');
           model.setAttribute('gltf-model', './assets/articuno/scene.gltf');
    	   const div = document.querySelector('.instructions');
	   div.innerText = model.info;
        }

        model.setAttribute('animation-mixer', '');

        scene.appendChild(model);
    });

