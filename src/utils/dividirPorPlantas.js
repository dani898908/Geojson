export const dividirPorPlantas = (GeoJSON) => {
	// Guardamos todas las plantas posibles (viene del numero de features)
	let nDePlantas = GeoJSON.features.map((feature) => {
		return feature.properties.Planta;
	});

	// Eliminamos duplicados
	nDePlantas = nDePlantas.filter((planta, index) => {
		return nDePlantas.indexOf(planta) === index;
	});

	// Crear array que contenga el número de plantas identico
	let misPlantas = new Array(nDePlantas.length);

	// Asignar las propiedas principales del GeoJSON al array, dejando los features vacios.
	for (let i = 0; i < misPlantas.length; i++) {
		let nuevoGeoJSON = JSON.parse(JSON.stringify(GeoJSON));
		nuevoGeoJSON.features = [];
		misPlantas[i] = nuevoGeoJSON;
	}

	// console.log("misPlantas", misPlantas);
	// let misPlantas = JSON.parse(JSON.stringify(GeoJSON));
	for (let i = 0; i < nDePlantas.length; i++) {
		let Planta = [];
		for (let x = 0; x < GeoJSON.features.length; x++) {
			if (GeoJSON.features[x].properties.Planta === nDePlantas[i]) {
				Planta.push(GeoJSON.features[x]);
			}
		}
		misPlantas[i].features.push(Planta);
	}

	return misPlantas;
};
