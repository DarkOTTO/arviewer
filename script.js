window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = 'C';

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
                lat: 37.563388379,
                lng: 126.83021069,
            },
        },
    ];
}

function getLocation() {
    if (navigator.geolocation) { // GPS를 지원하면
	navigator.geolocation.getCurrentPosition(function(position) {
	    alert(position.coords.latitude + ' ' + position.coords.longitude);
	    return position.coords;
	}, function(error) {
	    console.error(error);
	});
    } else {
    	alert('GPS를 지원하지 않습니다');
    }
}

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
	val position = getLocation();
        model.setAttribute('gps-entity-place', 'latitude: ${latitude}; longitude: ${longitude};`);
// 	model.setAttribute('gps-entity-place', 'latitude: position.latitude; longitude: position.longitude;');

        if (place.name.localeCompare("Starbucks") == 0) {
//            model.setAttribute('scale', '0.5 0.5 0.5');
//           model.setAttribute('rotation', '0 180 0');
           model.setAttribute('gltf-model', './assets/magnemite/scene.gltf');
        } else {
          setModel(models[modelIndex], model);
           model.setAttribute('scale', '0.1 0.1 0.1');
           model.setAttribute('rotation', '0 180 0');
           model.setAttribute('gltf-model', './assets/articuno/scene.gltf');
    	   const div = document.querySelector('.instructions');
// 	   div.innerText = position.coords.latitude + ' ' + position.coords.longitude;
	   div.innerText = model.info;
//         }

        model.setAttribute('animation-mixer', '');

        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
        });

        scene.appendChild(model);
    });

