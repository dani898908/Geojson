import React from "react";
import { Component } from "react";
import L from "leaflet";
import "leaflet-easybutton";
import "leaflet/dist/leaflet.css";
import archivoGeoJSON from "./geojson.json";
import * as $ from "jquery";


const southWest = L.latLng(40.46751056468401, -3.8018542796372);
const northEast = L.latLng(40.46751056468401, -3.8018542796372);
const mybounds = L.latLngBounds(southWest, northEast);

let config = {};
config.params = {
	center: [40.46751056468401, -3.8018542796372],
	zoom: 18,
	zoomSnap: 0.1,
	minZoom: 3,
	maxBounds: mybounds,
	opacity: 0,
	zoomControl: false,
};
config.tileLayer = {
	//Original:
	uri: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
	attribution:
		'&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	params: {
		maxZoom: 20,
	},
};

class HomeMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null,
		};
	}
	myStyle = () => {
		return {
			fillColor: "##FFFFFFFF",
			weight: 0.5,
			color: "grey",
			fillOpacity: 50,
		};
	};

	componentDidMount() {
		let map = L.map("map", config.params);
		const tileLayer = L.tileLayer(
			config.tileLayer.uri,
			config.tileLayer.params,
			config.tileLayer.attribution
		);

		this.setState({ map, tileLayer });
		this.placeHolder = L.featureGroup();
		this.placeHolder.addTo(map);
		this.placeHolder.addLayer(tileLayer);

		this.abovefive = new L.geoJson(archivoGeoJSON, {
			polygon: this.abovefive_polygon,
			onEachFeature: this.onEachFeature_f,
			style: this.agglosFilter,
		}).addTo(map);
        var helloPopup = L.popup().setContent('Inicia el tour, Clic al icono!');

			L.easyButton('<i class="far fa-hand-point-right">Clic aqui</i>', function(btn, map){
				helloPopup.setLatLng(map.getCenter()).openOn(map);
			}).addTo( map );
		//var plantasEdificio = L.layerGroup().addTo(map);

		var plantaDos = L.geoJson(archivoGeoJSON, {
			filter: Planta2filter,
		});
		function Planta2filter(feature) {
			if (feature.properties.Planta === 2)
				return feature.properties.Planta === 2;
			else return null;
		}
		// plantasEdificio.addLayer(plantaDos);

		var plantaUno = L.geoJson(archivoGeoJSON, { filter: Planta1filter });

		function Planta1filter(feature) {
			if (feature.properties.Planta === 1)
				return feature.properties.Planta === 1;
			else return null;
		}

		//plantasEdificio.addLayer(plantaUno);

		var plantaCero = L.geoJson(
			archivoGeoJSON,
			{ filter: Planta0filter },
			{ color: "grey" }
		);
		function Planta0filter(feature) {
			if (feature.properties.Planta === 0) {
				return true;
			}
		}

		const logo = L.control({ position: "bottomright" });
		logo.onAdd = function () {
			let wrapper = L.DomUtil.create("div", "logo");

			let controlContent =
				'<div id="c1"><img id="imagen-edificio" src="edificio.png" width="30px" alt="Edificio"/><h1></h1></div>';

			controlContent +=
				'<div id="c2"><div id="expandable-container-visible">';
			controlContent +=
				'<div id="planta1" class="radio-input"><label><input id="primera-planta" type="radio" name="planta" class="Planta"/><h1>Primera Planta</h1></label></div>';
			controlContent +=
				'<div id="planta2" class="radio-input"><label><input id="segunda-planta" type="radio" name="planta" class="Planta"/><h1>Segunda Planta</h1></label></div>';
			controlContent +=
				'<div id="planta3" class="radio-input"><label><input id="tercera-planta" type="radio" name="planta" class="Planta"/><h1>Tercera Planta</h1></label></div>';
			controlContent += "</div></div>";

			wrapper.innerHTML = controlContent;

			// L.DomEvent.on(wrapper, "click", function (ev) {});
			return wrapper;
		};
		logo.addTo(map);

		document.getElementById("imagen-edificio").addEventListener(
			"click",
			function () {
				$("#expandable-container-visible").show("fast", "swing");
				$("#imagen-edificio").hide("fast", "swing");
			},
			false
		);

		document
			.getElementById("expandable-container-visible")
			.addEventListener(
				"click",
				function (e) {
					console.log("className", e.target.className);
					console.log("nodeName", e.target.nodeName);
					if (
						e.target.className === "radio-input" ||
						e.target.nodeName === "LABEL" ||
						e.target.nodeName === "INPUT"
					) {
						console.log("HOLA");
						return;
					} else {
						$("#expandable-container-visible").hide(
							"fast",
							"swing"
						);
						$("#imagen-edificio").show("fast", "swing");
					}
				},
				false
			);

		$(document).ready(function () {
			$("#tercera-planta").on("change", function () {
				if (this.checked) {
					$(map.addLayer(plantaCero)).show();
					$(map.removeLayer(plantaUno)).hide();
					$(map.removeLayer(plantaDos)).hide();
				}
			});
		});
		$(document).ready(function () {
			$("#segunda-planta").on("change", function () {
				if (this.checked) {
					$(map.addLayer(plantaDos)).show();
					$(map.removeLayer(plantaCero)).hide();
					$(map.removeLayer(plantaUno)).hide();
				}
			});
		});

		$(document).ready(function () {
			$("#primera-planta").on("change", function () {
				if (this.checked) {
					$(map.addLayer(plantaUno)).show();
					$(map.removeLayer(plantaCero)).hide();
					$(map.removeLayer(plantaDos)).hide();
				}
			});
		});
		
	}

	onEachFeature_f = (feature, layer) => {
		layer.bindPopup(JSON.stringify(feature.properties.Descripcion));
	};

	agglosFilter = (feature) => {
		return {
			fillColor: "rgba(255,255,255,0.1)",
			weight: 1,
			color: "grey",
			fillOpacity: 50,
		};
	};

	render() {
		return <div id="map" />;
	}
}

export default HomeMap;
