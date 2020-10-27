import { html, LitElement } from 'lit-element';
import style from './scss/style.scss';
import jQuery from './vendors/jquery.min.js';
import Hammer from 'hammerjs';
import propagating from 'propagating-hammerjs';
import panzoom from 'panzoom';
//import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import config from "./config";

import { LoaderSVG } from "./scss/images/loading.svg";

const { detect } = require('detect-browser');
const browser = detect();

var ODHdata;

class MapView extends LitElement {

	constructor() {
		super();
		/*//console.log('......Constructor......');
			//console.group('this in constructor()');
			//console.log(this);
		//console.groupEnd();*/

		const userLanguage = window.navigator.userLanguage || window.navigator.language;
		this.language = userLanguage.split('-')[0];
		this.title = 'ODH Webcomponent';
	}

	static get properties() {
		// prende i data attributes dall'elemento component (es. <map-view language=""></map-view>)
		return {
			language: { type: String },
		};
  	}

	render() {
		return html`
			<div class="inner-map-component" class="axonometric" data-building='axonometric'>
				<style>
					${getStyle(style)}
				</style>
				<div class="header">
					<div class="aux">
						<div class="navbar-container hide">
							<p class="site-title hide clickable" data-building-code="axonometric">NOI Techpark Maps</p>
							<nav class="dropdown building-select hide">
								<span class="dropdown-trigger hide"></span>
								<ul class="dropdown-list hide"></ul>
							</nav>
						</div>
						<span class="search-trigger icon-search translatable">Ricerca</span>
						<span class="option-trigger icon-option"><span class="icon translatable">Filtri</span></span>
						<div class="search-container" style="">
							<div class="input-container">
								<input type="text" placeholder="Ricerca (minimo 3 caratteri)" class="search translatable" />
							</div>
							<div class="category-group-container">
								<div class="no-results-container"><p>No results</p></div>
								<div class="category-group original" style="display:none;">
								    <div class="group-title-container dropdown-trigger">
								        <h2></h2>
								    </div>
								    <ul class="group-rooms-list dropdown-list" style="display:block;">
								    </ul>
								</div>
							</div>
						</div>
						<div class="option-filter-container">
							<div class="title-container">
								<span class="option-close icon-close"><span class="icon translatable">Chiudi</span></span>
								<h2 class="translatable">Chiudi i filtri</h2>
							</div>
							<div class="filter-container-container">
								<div class="filter-container">
									<p class="accent-color translatable">Visibilità elementi in planimetria</p>
									<ul class="filters">
										<li class="single-filter">
											<input class="all-filters-checkbox" type="checkbox" id="all-1" checked="checked">
											<label for="all-1" class="translatable">Attiva tutte le opzioni</label>
										</li>
										<li class="single-filter original">
											<input type="checkbox" id="" checked="checked" data-category="" class="filter-trigger" />
											<label for=""></label>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="mapContainer">
					<div class="loader loader-map">
						<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#010101"> <g fill="none" fill-rule="evenodd" stroke-width="2"> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" /> <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" /> </circle> <circle cx="22" cy="22" r="1"> <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" /> <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" /> </circle> </g></svg>
					</div>	
					<div id="map">
					</div>
					<div class="tooltip">
						<div class="pin">PIN</div>
						<div class="card">
							<div class="heading">
								<span class="icon hide"></span>
								<div class="name-short-description-container">
									<p class="name hide"></p>
									<p class="short-description hide"></p>
								</div>
							</div>
							<div class="long-description"></div>
							<div class="lower hide">
								<p class="expand-info hide translatable">Info</p>
								<p class="view-floorplan hide translatable">Vedi planimetria</p>
								<a class="website hide" target="_blank">Website</a>
								<p class="share-element hide translatable">Share</p>
							</div>
						</div>
					</div>
					<div class="floors-zoom-selector">
						<div class="floors-selector hide">
							<span class="icon-building icon-building-A1">A1</span>
							<ul class="floors-list">
							</ul>
						</div>
						<div class="zoom-selector">
							<span class="plus">+</span>
							<span class="minus">_</span>
						</div>
					</div>
				</div>
				<span class="js-media-query-tester"></span>
				<div class="sharer-container hide">
					<div class="sharer">
						<input type="text" id="sharer-url-input" readonly />
						<span id="copy-sharer-url" class="translatable">Copia link</span>
					</div>
				</div>
			</div>
		`;
		/*return html`
			${styleTag()}
			${scriptTag()}
			<div id="noi-map" style='background:url(./src/grape.jpg);background-size:cover'></div>
			<div id="myElement">Drag Me</div>
			<div id="status">Thanks for the fish</div>
			<div id="target"></div>
		`;*/
	}




	firstUpdated(changedProperties) {
		var shadowRoot = this.shadowRoot;
		var thisLang = this.language;
		documentReady(shadowRoot,thisLang);
			/*jQuery.each(result.data, function(i, field){
					//console.log(field.sname);
					jQuery(results).append('<li>'+field.sname+'</li>');
			});*/
	}

	/*createRenderRoot() {
		//this.attachShadow({mode: "closed"});
		return this;
	}*/
}

function getStyle(style) {
	return style[0][1];
}

var ODHdata = '';
var controller = '';
var jsMediaQueryTester = '.js-media-query-tester';
var shadowRoot = '';
var buildings_summary = [];
var clickedElementID = '';
var thisNoiMapsSettingsLang = 'it';
var originalTooltip = '';
var maps_svgs = [];
var NOIrooms = [];
var selettoriType = [];
var translations = [];
var minCharsToSearch = 2;

function resizeEndActions(){
	setTooltipPosition();
	//mapContainerHeight();
	//tooltipViewport();
	//langSwitcherLabels();
	sidebarHeight();
	if(typeof controller === 'object' && controller !== null && typeof controller.moveBy!='undefined') {
		try {
			controller.moveBy(0.001, 0.001);
		}catch(err) {}
	}
}

function cleanupRoomLabel(roomLabel) {
	if(typeof roomLabel !== 'undefined') {
		return roomLabel.replace(/ |\./g,'-')
	}
	return false;
}

function documentReady(shadowRootInit,thisLang) {
	shadowRoot = shadowRootInit;


	//Disables scroll events from mousewheels, touchmoves and keypresses.
	//disableBodyScroll(shadowRoot.querySelectorAll('.inner-map-component'));

	if (browser) {
		jQuery(shadowRoot.querySelectorAll('.inner-map-component')).addClass("browser-"+browser.name);
	}

	var NoiMapsSettingsUrlChecker = new URL(window.location.href);
	var NoiMapsSettingsShared = NoiMapsSettingsUrlChecker.searchParams.get("shared");
	var NoiMapsSettingsLang = NoiMapsSettingsUrlChecker.searchParams.get("lang");
	
	if(typeof thisLang != 'undefined' && thisLang !== null || jQuery.inArray( thisLang, ['it','en','de'] ) >= 0) {
		thisNoiMapsSettingsLang = thisLang;
	}
	if(typeof NoiMapsSettingsLang !== 'undefined' && NoiMapsSettingsLang!=null && jQuery.inArray( thisLang, ['it','en','de'] ) >= 0) {
		thisNoiMapsSettingsLang = NoiMapsSettingsLang;
	}


	//console.log("Lingua "+thisNoiMapsSettingsLang);

	//FETCH NOI DATA
	jQuery.getJSON(config.OPEN_DATA_HUB_ONLY_SHOW_MAP, function(result){
		
		ODHdata = result;
		for(var i in ODHdata.data) {
			let roomLabel = ODHdata.data[i].smetadata.room_label;
			if(typeof roomLabel !== 'undefined') {
				roomLabel = cleanupRoomLabel(roomLabel);
				NOIrooms[roomLabel] = ODHdata.data[i].smetadata;
			}
		}

		//CHECK RESULTS FIRST FETCH (NOI DATA ALLS) AND THEN GET BUILDINGS
		if(Object.keys(ODHdata).length > 0) {
			writeGroupsSidebar(ODHdata);
			//console.log('OPEN_DATA_HUB_ONLY_SHOW_MAP valid');

			//THEN GET BUILDINGS
			jQuery.getJSON(config.OPEN_DATA_HUB_BUILDINGS, function(result){
				//buildings = result;
				printMap("axonometric");

				for(var i in result.data) {
					buildings_summary[result.data[i].smetadata.building_code] = result.data[i].smetadata;
				}
				if(typeof roomLabel !== 'undefined') {
					roomLabel = roomLabel.replace(/ |\./g,'-');
					NOIrooms[roomLabel] = ODHdata.data[i].smetadata;
				}

				//Check buildings length
				if( Object.keys(NOIrooms).length > 0 ) {
					//console.log('OPEN_DATA_HUB_BUILDINGS valid');
					setTimeout(function() {
						jQuery(shadowRoot.querySelectorAll('.loader')).fadeOut();
						getTranslations();
						
						//CHECK SHARE


						//EVERYTHING IS LOADED (PROBABLY)
						jQuery(shadowRoot.querySelectorAll(".loader-map")).addClass('map-loaded');

						setTimeout(function() {
							if(typeof(NoiMapsSettingsShared)!='undefined' && NoiMapsSettingsShared!=null && NoiMapsSettingsShared!='') {
								clickedElement(NoiMapsSettingsShared.toUpperCase());
							}
						}, 500)
					},500);
				} 
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				location.reload();
		        //console.log("error " + textStatus);
		        //console.log("incoming Text " + jqXHR.responseText);
		    	setTimeout(function() {
		    		documentReady(shadowRootInit,thisLang);
		    	})
		    })
			.always(function() {
				setupMapBehaviours();
			});

		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
        //console.log("error " + textStatus);
        //console.log("incoming Text " + jqXHR.responseText);
    })
    .always(function() {
		clickableBehaviour();
		/*setTimeout(function() {
			//console.log(NOIrooms);
		},500);*/
	});

	
	//startHammer(shadowRoot);
	
	
	originalTooltip = jQuery(shadowRoot.querySelectorAll('.tooltip')).html();

	jQuery(shadowRoot.querySelectorAll('.option-trigger')).on('click',function(){
		jQuery(shadowRoot.querySelectorAll('.inner-map-component')).addClass('option-open');
	});
	jQuery(shadowRoot.querySelectorAll('.option-close')).on('click',function(){
		jQuery(shadowRoot.querySelectorAll('.inner-map-component')).removeClass('option-open');
	});
	jQuery(shadowRoot.querySelectorAll('.search-trigger')).on('click',function(){
		jQuery(shadowRoot.querySelectorAll('.inner-map-component')).toggleClass('search-open');
		if(jQuery(shadowRoot.querySelectorAll('.inner-map-component')).hasClass('search-open')) {
			jQuery(shadowRoot.querySelectorAll("input.search")).focus();
		}
		setTimeout(function() {
			setTooltipPosition();
		},300);
	});

	dropdownToggle();
	dropdownSelection();
	sharerBehaviours();

	sidebarHeight();

	jQuery(window).resize(function() {
		//console.log('Resizing....');
		clearTimeout(window.resizedFinished);
		window.resizedFinished = setTimeout(function(){
			resizeEndActions();
		}, 250);
	});


	/*//console.group('this.shadowRoot');
	//console.log(shadowRoot);
	//console.groupEnd();*/

	/*jQuery(shadowRoot.getElementById('loadAll')).click(function() {
		jQuery(shadowRoot.getElementById('results')).text('Loading....');
		jQuery(shadowRoot.getElementById('results')).text(JSON.stringify(ODHdata, undefined, 4));	
	})

	jQuery(shadowRoot.getElementById('loadToMap')).click(function() {
		//console.log('click');
		
		clickable(shadowRoot);
	});

	*/
}

function getTranslations() {
	jQuery.getJSON(config.OPEN_DATA_HUB_TRANSLATIONS, function(result){
		let objects = result.data.filter(function(v){
			return v.mvalue=="Traduzioni";
		});
		/*objects = Object.values(objects[0].tmetadata);
		objects = objects.sort((a, b) => (a.order > b.order) ? 1 : -1);*/
		if(typeof objects[0] !== 'undefined' && objects[0]!=null) {
			translations = objects[0].tmetadata;
		}

		if( Object.keys(translations).length > 0 ) {
			clickableBehaviour();
			getSelettoriType();
			searchElementsStarter();			

			translateElements();

		} else {
			location.reload();
			//getTranslations();
			return;
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		location.reload();
		return;
	})
	.always(function() {
		
	});
}

function translateElements() {
	jQuery(shadowRoot.querySelectorAll(".translatable")).each(function() {
		if(jQuery(this).is('input')) {
			jQuery(this).attr( 'placeholder', getTranslation(jQuery(this).attr('placeholder')) );
		} else {
			jQuery(this).text( getTranslation(jQuery(this).text()) );
		}
	});
}

function getBuildingData(buildingCode, key) {
	if(typeof buildings == 'undefined' || typeof buildings.data == 'undefined' || typeof buildingCode == 'undefined' || typeof key == 'undefined' || key == '' || key == null) {
		return false;
	}
	for(var i in buildings.data) {
		if(typeof buildings.data[i].smetadata.building_code !== 'undefined' && buildings.data[i].smetadata.building_code == buildingCode) {
			if(typeof buildings.data[i].smetadata[key] !== 'undefined') {
				return buildings.data[i].smetadata[key];
			}
		}
	}
	return false;
}

function printMap(this_building_code) {
	if(Object.keys(maps_svgs).length === 0) {
		fetchMapsSVG(this_building_code);
	}
}

function fetchMapsSVG(this_building_code) {
	jQuery.getJSON(config.OPEN_DATA_HUB_FLOORS, function(result){
		for(var i in result.data) {
			let currentBuildingCode = result.data[i].smetadata.building_code;

			maps_svgs[currentBuildingCode] = [];
			maps_svgs[currentBuildingCode]['floors'] = {};

			let currentBuildingFloor = result.data[i].smetadata.floor;;

			if(typeof result.data[i].smetadata.building_code !== 'undefined' && typeof result.data[i].smetadata.image !== 'undefined') {
				jQuery.get(result.data[i].smetadata.image, (data2) => {
					let $svg = jQuery(data2).find('svg');
					// Remove any invalid XML tags as per http://validator.w3.org
					$svg = $svg.removeAttr('xmlns:a');
					// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
					if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
						$svg.attr(`viewBox 0 0  ${$svg.attr('height')} ${$svg.attr('width')}`);
					}

					maps_svgs[currentBuildingCode]['floors'][currentBuildingFloor] = $svg.prop("outerHTML");

					if(typeof this_building_code !== 'undefined' && typeof currentBuildingCode !== 'undefined' && currentBuildingCode == this_building_code) {
						jQuery(shadowRoot.getElementById('map')).html($svg.prop("outerHTML"));
						setTimeout(function() {
							clickableBehaviour();
						},50);
					}
				}, 'xml');
			}
		}
	});
}


function drawRooms() {
	for(var i in ODHdata.data) {
		let beaconID = ODHdata.data[i].smetadata.beacon_id;
		let x = jQuery(shadowRoot.getElementById('map')).find(".clickable#"+beaconID).children().attr('x');
		if(isNaN(x)) {
			x = 0;
		}
		let y = jQuery(shadowRoot.getElementById('map')).find(".clickable#"+beaconID).children().attr('y');
		if(isNaN(y)) {
			y = 0;
		}
		x = parseInt(x)+20;
		y = parseInt(y)+20;
		jQuery(shadowRoot.getElementById('map')).find(".clickable#"+beaconID).append('<text x="'+x+'" y="'+y+'">'+beaconID+'</text>');
	}
	shadowRoot.getElementById('Livello_1').innerHTML += '';
}

function writeGroupsSidebar(ODHdata) {
	jQuery.getJSON(config.OPEN_DATA_HUB_TYPES_GROUPS, function(result){
		let objects = result.data.filter(function(v){
			return v.mvalue=="Selettori Group";
		});
		/*objects = Object.values(objects[0].tmetadata);
		objects = objects.sort((a, b) => (a.order > b.order) ? 1 : -1);*/
		objects = objects[0].tmetadata;
		let categoryGroup = jQuery(shadowRoot.querySelectorAll(".search-container .category-group")).clone();
		categoryGroup.removeClass("original");
		var sorted = [];
		////console.log(objects);
		for(var groupName in objects) {
			var orderN = objects[groupName]['order'];
			var temp = objects[groupName];
			temp['name'] = groupName;
			sorted[orderN] = temp;
			
		}

		for(var index in sorted) {
			let categoryGroupClone = categoryGroup.clone().removeAttr("style");
			////console.log(objects);
			let image = '';
			if(typeof sorted[index].image !== 'undefined'){
				image = '<img src="'+sorted[index].image+'" />';
			}
			categoryGroupClone.find('.group-title-container').prepend(image);
			categoryGroupClone.find('h2').text(sorted[index].name);
			
			for(var k in ODHdata.data) {
				if(ODHdata.data[k].smetadata.group == sorted[index].name && typeof ODHdata.data[k].smetadata.name !== 'undefined' && ODHdata.data[k].smetadata.name[thisNoiMapsSettingsLang]!=='undefined') {
					let elementCode = cleanupRoomLabel(ODHdata.data[k].smetadata.room_label);
					let roomPieces = elementCode.split("-");
					let roomNr = roomPieces[roomPieces.length - 1];
					if(isNaN(roomNr)) {
						roomNr = roomPieces[roomPieces.length - 2] +"-"+roomPieces[roomPieces.length - 1];
					}
					categoryGroupClone.find('.group-rooms-list').append('<li class="clickable" data-building-code="'+roomPieces[0]+'" data-room-code="'+elementCode+'" data-floor-code="'+ODHdata.data[k].smetadata.floor+'">('+ODHdata.data[k].smetadata.beacon_id+") "+ODHdata.data[k].smetadata.name[thisNoiMapsSettingsLang]+'</li>')
				}
			}

			jQuery(shadowRoot.querySelectorAll(".search-container .category-group-container")).append(categoryGroupClone);
			
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		location.reload();
		return;
	})
}

function filtersBehaviours() {
	for(let i in selettoriType) {
		/*let filter = jQuery(shadowRoot.querySelectorAll(".filter-container .single-filter.original")).clone();
		filter.text(selettoriType[i][thisNoiMapsSettingsLang]);
		jQuery(shadowRoot.querySelectorAll(".filter-container")).append(filter);*/
		if(typeof selettoriType[i]['name']!== 'undefined' && selettoriType[i]['name']!==null && typeof selettoriType[i]['name'][thisNoiMapsSettingsLang]!== 'undefined' && selettoriType[i]['name'][thisNoiMapsSettingsLang]!==null) {
			let filter = jQuery(shadowRoot.querySelectorAll(".filter-container .filters .single-filter.original")).clone();
			filter.removeClass('original');
			filter.find('label').text(selettoriType[i]['name'][thisNoiMapsSettingsLang]);
			filter.find('label').attr("for","filter-"+i);
			filter.find('input').attr("id","filter-"+i);
			filter.find('input').attr("data-category",i);


			jQuery(shadowRoot.querySelectorAll(".filter-container .filters")).append(filter);
		}

	}


	jQuery(shadowRoot.querySelectorAll(".all-filters-checkbox")).click(function(){
		if(jQuery(this).is(':checked')) {
			jQuery(shadowRoot.querySelectorAll(".filter-container .single-filter .filter-trigger")).prop( "checked", true );
		} else {
			jQuery(shadowRoot.querySelectorAll(".filter-container .single-filter .filter-trigger")).prop( "checked", false );
		}
		jQuery(shadowRoot.querySelectorAll(".filter-container .single-filter .filter-trigger")).trigger('change');
	});

	jQuery(shadowRoot.querySelectorAll(".filters .single-filter .filter-trigger")).change(function(){
		let thisEl = jQuery(this);
		if(typeof thisEl.data('category')!== 'undefined' && thisEl.data('category').length>0 ) {
			if(thisEl.is(':checked')) {
				jQuery(shadowRoot.querySelectorAll('g[data-category="'+thisEl.data('category')+'"] image')).fadeIn('fast');
			} else {
				jQuery(shadowRoot.querySelectorAll('g[data-category="'+thisEl.data('category')+'"] image')).fadeOut('fast');
			}
		}		
	});
}

function getSelettoriType() {
	/*jQuery.getJSON(config.OPEN_DATA_HUB_TYPES_GROUPS, function(result){
		let objects = result.data.filter(function(v){
			return v.mvalue=="Selettori Type";
		});
		objects = Object.values(objects[0].tmetadata);
		objects = objects.sort((a, b) => (a.order > b.order) ? 1 : -1);
		if(typeof objects[0] !== 'undefined' && objects[0]!=null) {
			selettoriType = objects[0].tmetadata;*/
			/*for(var i in selettoriType) {
				if(typeof selettoriType[i]['image'] !== 'undefined' && selettoriType[i]['image'] !== null) {
					jQuery.get(selettoriType[i]['image'], (data2) => {
						let $svg = jQuery(data2).find('svg');
						// Remove any invalid XML tags as per http://validator.w3.org
						$svg = $svg.removeAttr('xmlns:a');
						// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
						if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
							$svg.attr(`viewBox 0 0  ${$svg.attr('height')} ${$svg.attr('width')}`);
						}
						selettoriType[i]['SVG'] = $svg.prop("outerHTML");
					}, 'xml');
				}
			}*/
		/*}
	});*/

	jQuery.getJSON(config.OPEN_DATA_HUB_TYPES_GROUPS, function(result){
		let objects = result.data.filter(function(v){
			return v.mvalue=="Selettori Type";
		});
		/*objects = Object.values(objects[0].tmetadata);
		objects = objects.sort((a, b) => (a.order > b.order) ? 1 : -1);*/
		if(typeof objects[0] !== 'undefined' && objects[0]!=null) {
			selettoriType = objects[0].tmetadata;
		}
		//filtersBehaviours();
		if( Object.keys(selettoriType).length > 0 ) {
			filtersBehaviours();
		} else {
			getSelettoriType();
			return;
		}

		

		/*for(var i in selettoriType) {
			if(typeof selettoriType[i]['image'] !== 'undefined' && selettoriType[i]['image'] !== null) {
				jQuery.get(selettoriType[i]['image'], function (data) {
				    selettoriType[i]['image'] = data;
				});
			}
		}*/
	});
}


function startHammer(shadowRoot) {
	//console.log('starting hammer');
	var mc = new Hammer(shadowRoot.getElementById("myElement"));
	var lastPosX = 0;
	var lastPosY = 0;
	var isDragging = false;
	mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
	mc.on("pan", function(ev){
		var elem = ev.target;  
		// DRAG STARTED
		// here, let's snag the current position
		// and keep track of the fact that we're dragging
		if ( ! isDragging ) {
			isDragging = true;
			lastPosX = elem.offsetLeft;
			lastPosY = elem.offsetTop;
		}
		// we simply need to determine where the x,y of this
		// object is relative to where it's "last" known position is
		// NOTE: 
		//    deltaX and deltaY are cumulative
		// Thus we need to always calculate 'real x and y' relative
		// to the "lastPosX/Y"
		var posX = ev.deltaX + lastPosX;
		var posY = ev.deltaY + lastPosY;
		// move our element to that position
		elem.style.left = posX + "px";
		elem.style.top = posY + "px";
		if (ev.isFinal) {
			isDragging = false;
		}
	});
}


function setupMapBehaviours() {
	//Disable scroll (Safari zoom bug)
	//shadowRoot.getElementById("map").disablescroll();

	//Panzoom Map
	controller = panzoom(shadowRoot.getElementById("map"), {
		zoomDoubleClickSpeed: 1, //disable doubleclick to zoom
		zoomSpeed: 0.04,
		maxZoom: 10,
		minZoom: 1,
		smoothScroll: true,
		bounds: true,
		boundsPadding: 1,
		boundsDisabledForZoom: true
	});
	controller.on('transform', function(e) {
		setTooltipPosition();
	});

	setMapZoom(shadowRoot);	

	//Clickables
	//Tooltip & View floorplans
	

	jQuery(shadowRoot.querySelectorAll("#mapContainer")).unbind();
	var hammertime = propagating(new Hammer(jQuery(shadowRoot.querySelectorAll("#mapContainer"))[0], {}));
	hammertime.off('tap');
	hammertime.on('tap', function(ev) {
		if( jQuery(ev.firstTarget).parents('.tooltip.active').length==0 ) {
			jQuery(shadowRoot.querySelectorAll("#map .clickable")).each(function(i) {
				var thisClickable = jQuery(this);
				var oldClasses = thisClickable.attr('class');
				if(oldClasses.indexOf('active')!=-1) {
					oldClasses = oldClasses.replace(' active','');
					oldClasses = oldClasses.replace('active','');
					thisClickable.attr('class', oldClasses);
				}
			});
		}

		if(typeof(ev)!='undefined' && typeof(ev.firstTarget)!='undefined') {
			if( jQuery(ev.firstTarget).parents('.tooltip').length == 0 && !jQuery(ev.firstTarget).hasClass('clickable') && jQuery(ev.firstTarget).parents('.clickable').length == 0 ) {
				closeTooltip(ev, shadowRoot);
			}
			if( jQuery(ev.firstTarget).hasClass('share-element') ) {
				jQuery(shadowRoot.querySelectorAll('.sharer-container')).removeClass('hide').fadeIn();
				jQuery(shadowRoot.querySelectorAll('.sharer-container')).find('input').val(location.origin+location.pathname+'?shared='+jQuery(shadowRoot.querySelectorAll('.share-element')).attr('data-element-code')+'&lang='+thisNoiMapsSettingsLang);
				jQuery(shadowRoot.querySelectorAll('.sharer-container')).find('input').select();
			}
			if(
				jQuery(ev.firstTarget).parents('.tooltip').length>0 &&
				(
					jQuery(ev.firstTarget).hasClass('heading') ||
					jQuery(ev.firstTarget).parents('.heading').length>0 ||
					jQuery(ev.firstTarget).hasClass('expand-info')
				)
			) {
				jQuery(shadowRoot.querySelectorAll('.tooltip')).find('.long-description').slideToggle();
			}
		}
		if(
			jQuery(ev.firstTarget).hasClass('view-floorplan') &&
			typeof(jQuery(ev.firstTarget).data('building-code'))!=='undefined' && jQuery(ev.firstTarget).data('building-code')!==null && jQuery(ev.firstTarget).data('building-code')!=='' &&
			typeof(jQuery(ev.firstTarget).data('building-floor'))!=='undefined' && jQuery(ev.firstTarget).data('building-floor')!==null && jQuery(ev.firstTarget).data('building-floor')!==''
		) {
			goToBuildingFloor(jQuery(ev.firstTarget).data('building-code'),jQuery(ev.firstTarget).data('building-floor'), true);

		}
	});

	//Navbar
	jQuery(shadowRoot.querySelectorAll(".navbar-container .site-title")).click(function(e) {
		e.preventDefault();
		//console.log('GOING OUTSIDE..........');
		goToBuildingFloor('axonometric','0', true);
		if(typeof(controller)!='undefined') {
			try {
				mapContainerHeight();
			}catch(err) {}
		}		
		return;
	});



	//Zoom controls
	var hammertimeZoom = new Hammer(shadowRoot.querySelectorAll(".floors-zoom-selector .zoom-selector .plus")[0], {});
	hammertimeZoom.off('tap');
	hammertimeZoom.on('tap', function(evt) {
		controller.smoothZoom(jQuery(shadowRoot.getElementById("map")).outerWidth()/2,jQuery(shadowRoot.getElementById("map")).outerHeight()/2,1.5);
	});
	var hammertimeZoom2 = new Hammer(shadowRoot.querySelectorAll(".floors-zoom-selector .zoom-selector .minus")[0], {});
	hammertimeZoom2.off('tap');
	hammertimeZoom2.on('tap', function(evt) {
		controller.smoothZoom(jQuery(shadowRoot.getElementById("map")).outerWidth()/2,jQuery(shadowRoot.getElementById("map")).outerHeight()/2,0.5);
	});

	clickableBehaviour();
}

function setMapZoom() {
	if(typeof(controller)!='undefined') {
		controller.zoomAbs(0, 0, 1);
		controller.moveBy(0.001, 0.001);

		if(jQuery(shadowRoot.querySelectorAll(jsMediaQueryTester)).outerWidth()<=30) {
			//controller.zoomAbs(0, 0, 1.6);
			setTimeout(function() {
				if(jQuery(shadowRoot.querySelectorAll('.tooltip')).hasClass('active') && typeof(clickedElementID)!='undefined' && jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']")).length>0) {
					setTimeout(function() {
						var x = jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']")).offset().left;
						var y = jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']")).offset().top;

						if(x>jQuery("#map").innerWidth()/2) {
							controller.smoothZoom(x+(jQuery(shadowRoot.getElementById("#mapContainer")).innerWidth()/3),y,3);
						} else {
							controller.smoothZoom(x+(jQuery(shadowRoot.getElementById("#mapContainer")).innerWidth()/16),y,3);
						}

						
					},500);
				} else {
					if(jQuery(shadowRoot.querySelectorAll("#map #main-entrance")).length>0) {
						controller.smoothZoom(jQuery(shadowRoot.querySelectorAll("#map #main-entrance")).offset().left+jQuery(shadowRoot.querySelectorAll("#map #main-entrance"))[0].getBoundingClientRect().width/2, jQuery(shadowRoot.querySelectorAll("#map #main-entrance")).offset().top,3);
					} else {
						if(jQuery(shadowRoot.querySelectorAll('.inner-map-component')).hasClass('axonometric')) {
							controller.smoothZoom(jQuery(shadowRoot.getElementById("#map")).outerWidth()/2,jQuery(shadowRoot.getElementById("#map")).outerHeight()/2,2);
						} else {
							controller.smoothZoom(jQuery(shadowRoot.getElementById("#map")).outerWidth()/2,jQuery(shadowRoot.getElementById("#map")).outerHeight()/2,3);
						}
					}
				}
			},250);
		}

	}
}

function clickableBehaviour() {
	//Clickable elements (building SVG - sidebar groups)
	jQuery(shadowRoot.querySelectorAll('.clickable a')).unbind();
	jQuery(shadowRoot.querySelectorAll('.clickable')).unbind();
	jQuery(shadowRoot.querySelectorAll('.clickable a')).click(function(ev) { ev.preventDefault(); return false; });
	jQuery(shadowRoot.querySelectorAll('.clickable')).each(function() {
		var thisEl = this;
		if(typeof(jQuery(this).data('clickable'))=='undefined') {
			jQuery(this).data('clickable','true');
		} else {
			return true;
		}


		var hammertime = new Hammer(thisEl, {});
		hammertime.off('tap');
		setTimeout(function() {
			hammertime.on('tap', function(ev) {
				//console.log('clickableBehaviour TAP');
				var buildingCode = jQuery(thisEl).data('building-code');
				var roomCode = jQuery(thisEl).data('room-code');
				var floorCode = jQuery(thisEl).data('floor-code');
				//console.log('buildingCode '+buildingCode);
				//console.log('roomCode '+roomCode);
				//console.log('floorCode '+floorCode);
				jQuery(shadowRoot.querySelectorAll('.clickable')).not('.floor').removeClass('active');

				//Close navigator
				if(jQuery(thisEl).parents('.building-select').length > 0) {
					jQuery(thisEl).parents('.building-select').removeClass('open');
					jQuery(thisEl).parents('.building-select').find('.dropdown-list').slideToggle('fast');
				}

				if(
					typeof(buildingCode)!=='undefined' && buildingCode!='' &&
					( (typeof(floorCode)!=='undefined' && floorCode!='') || (floorCode===0)) &&
					typeof(roomCode)!=='undefined' && roomCode!=''
				) {
					//console.log('clicked sidebar');
					setMapZoom();
					if(jQuery(jsMediaQueryTester).outerWidth()<=30) {
						jQuery("body").removeClass('search-open');
					}
					//This is a room
					if(jQuery(shadowRoot.querySelectorAll(".inner-map-component")).attr('data-building')==buildingCode && jQuery(shadowRoot.querySelectorAll(".inner-map-component")).attr('data-floor')==floorCode) {
						//We are in the same building or in the same floor as the clicked element
						//console.log('same floor same building');			
						clickedElement(roomCode, 'room');
					} else {
						//console.log('goto building '+buildingCode+' floor '+floorCode);				
						goToBuildingFloor(buildingCode, floorCode, false);
						clickedElement(roomCode, 'room');
					}
				} else if(typeof(buildingCode)!='undefined' && buildingCode!='' && typeof(floorCode)=='undefined') {
					//console.log('clicked building');

					//This is a building
					if(jQuery(shadowRoot.querySelectorAll(".inner-map-component")).attr('data-building')=='axonometric') {
						var thisBuilding = typeof(jQuery(thisEl).data('building-code'))!=='undefined' && jQuery(thisEl).data('building-code')!==null && jQuery(thisEl).data('building-code')!=='' ? jQuery(thisEl).data('building-code') : false;
						var thisFloor = typeof(jQuery(thisEl).data('building-floor'))!=='undefined' && jQuery(thisEl).data('building-floor')!==null && jQuery(thisEl).data('building-floor')!=='' ? jQuery(thisEl).data('building-floor') : false;
						if(thisBuilding && thisFloor) {
							//We're in axonometric mode, clicked an item with buildingcode and floor -> go directly
							//console.log("We're in axonometric mode, clicked an item with buildingcode and floor -> go directly");
							goToBuildingFloor(thisBuilding, thisFloor, true);
						} else {
							//We're in axonometric mode, open popup
							//console.log("We're in axonometric mode, open popup");
							clickedElement(buildingCode, 'building');
						}								
					} else {
						//console.log('not axonometric We\'re inside some floor, goto building');
						//console.log(ev.target);
						//We're inside some floor, goto building
						goToBuildingFloor(buildingCode, '0', true);
					}
				} else if(
					typeof(buildingCode)!=='undefined' && buildingCode!='' &&
					(
						typeof(floorCode)!=='undefined' || floorCode===0
					)
				) {
					//console.log('clicked something with BUILDING and FLOOR');
					if(jQuery(shadowRoot.querySelectorAll(".inner-map-component")).attr('data-building')!=buildingCode || jQuery(shadowRoot.querySelectorAll(".inner-map-component")).attr('data-floor')!=floorCode) {
						goToBuildingFloor(buildingCode, floorCode);
					}
				}else {
					//console.log('Clicked something we dont know about');
					clickedElement(jQuery(thisEl).attr('id'),'room');
				}
			});
		}, 50);
	});
}


function clickedElement(elementCode, type="room") {
	if(Object.keys(NOIrooms).length === 0) {
		alert("NOIrooms empty - ERROR!");
	} else {
		if(
			typeof(elementCode)!='undefined' && elementCode!=null &&
			typeof(type)!='undefined' && type!=null
		) {
			
			////console.log('clicked element '+elementCode+' of type '+type);
			//$('.tooltip').html(originalTooltip);
			var icon_code = ''
			var name = '';
			var shortdesc = '';
			var longdesc = '';
			let website = false;

			if(type=="building") {
				if(typeof maps_svgs[elementCode] == 'undefined') {
					//console.log('ATTENZIONE! Non è presente alcuna mappa SVG per: '+elementCode);
					closeTooltip();
					return true;
				}
				if(typeof(buildings_summary[elementCode])!='undefined' && typeof maps_svgs[elementCode] !== 'undefined') {
					if(typeof(buildings_summary[elementCode]['building_code'])!='undefined' && buildings_summary[elementCode]['building_code']!='') {
						icon_code = "icon-building-"+buildings_summary[elementCode]['building_code'];
						clickedElementID = 'building_'+buildings_summary[elementCode]['building_code'];
						var oldClasses = jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']")).attr('class');
						if(oldClasses.indexOf('active')==-1) {
							oldClasses += ' active';
							jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']")).attr('class', oldClasses);						
						}
					}
					if(typeof(buildings_summary[elementCode]['building_name'][thisNoiMapsSettingsLang])!='undefined' && buildings_summary[elementCode]['building_name'][thisNoiMapsSettingsLang]!='') {
						name = buildings_summary[elementCode]['building_name'][thisNoiMapsSettingsLang];
					}
					if(typeof(buildings_summary[elementCode]['building_short_description'][thisNoiMapsSettingsLang])!='undefined' && buildings_summary[elementCode]['building_short_description'][thisNoiMapsSettingsLang]!='') {
						shortdesc = buildings_summary[elementCode]['building_short_description'][thisNoiMapsSettingsLang];
					}
					if(typeof buildings_summary[elementCode]!=='undefined' && typeof(buildings_summary[elementCode]['building_description'])!='undefined' && typeof(buildings_summary[elementCode]['building_description'][thisNoiMapsSettingsLang])!='undefined' && buildings_summary[elementCode]['building_description'][thisNoiMapsSettingsLang]!='') {
						longdesc = buildings_summary[elementCode]['building_description'][thisNoiMapsSettingsLang];
					}
				}
			}

			if(type=="room") {
				
				/*//console.log(NOIrooms[elementCode]);
				if(typeof NOIrooms[elementCode] == 'undefined') {
					//console.log(NOIrooms);
				}*/

				//console.groupCollapsed("clickedElement ROOM");
				//console.log(elementCode);
				//console.log(NOIrooms[elementCode]);
				//console.groupEnd();

				if(typeof(NOIrooms)!=='undefined' && NOIrooms!==null && NOIrooms!=='' && typeof NOIrooms[elementCode] !== 'undefined') {
					if(
						typeof NOIrooms[elementCode] !== 'undefined' && NOIrooms[elementCode]!=null &&
						typeof NOIrooms[elementCode]['type'] !== 'undefined' && NOIrooms[elementCode]['type']!=null &&
						typeof selettoriType[NOIrooms[elementCode]['type']] !== 'undefined' && selettoriType[NOIrooms[elementCode]['type']]!==null &&
						typeof selettoriType[NOIrooms[elementCode]['type']]['image'] !== 'undefined' && selettoriType[NOIrooms[elementCode]['type']]['image']!==null
					) {
						icon_code = selettoriType[NOIrooms[elementCode]['type']]['image'];
						var building = '';
						var floor = '';
					}



					//console.log('GHE SEEEEEM');
					//console.log(NOIrooms[elementCode]);
					name = typeof NOIrooms[elementCode]['name'] !== 'undefined' && typeof NOIrooms[elementCode]['name'][thisNoiMapsSettingsLang.toLowerCase()] !== 'undefined'  ? NOIrooms[elementCode]['name'][thisNoiMapsSettingsLang.toLowerCase()] : NOIrooms[elementCode]['room_label'];
					longdesc = typeof NOIrooms[elementCode]['description'] !== 'undefined' && typeof NOIrooms[elementCode]['description'][thisNoiMapsSettingsLang.toLowerCase()] !== 'undefined'  ? NOIrooms[elementCode]['description'][thisNoiMapsSettingsLang.toLowerCase()] : '';
					building = elementCode.split("-")[0];
					shortdesc += '<span class="room-icon-building icon-building-'+building+'">'+building+'</span>';

					floor = typeof NOIrooms[elementCode]['floor'] !== 'undefined' && !isNaN(NOIrooms[elementCode]['floor']) ? NOIrooms[elementCode]['floor'] : false;
					if(!isNaN(floor)) {
						shortdesc += '<span class="room-floor">'+floor+'</span>';
					}

					let roomPieces = elementCode.split("-");
					let roomNr = roomPieces[roomPieces.length - 1];
					if(isNaN(roomNr)) {
						roomNr = roomPieces[roomPieces.length - 2] +"-"+roomPieces[roomPieces.length - 1];
					}

					shortdesc += '<span class="room-number">'+roomNr+'</span>';

					website = typeof NOIrooms[elementCode]['link'] !== 'undefined' && NOIrooms[elementCode]['link'] !== '' ? NOIrooms[elementCode]['link'] : false;
					
					//if the requested room is not the actual viewed building or floor, goto
					if(
						building!=='' && floor !== '' &&
						( jQuery(shadowRoot.querySelectorAll('.inner-map-component')).data('building')!==building || jQuery(shadowRoot.querySelectorAll('.inner-map-component')).data('floor')!==floor )
					) {
						goToBuildingFloor(building, floor, false);
					}
					//setMapZoom();
				}


				clickedElementID = elementCode;
				//console.log('^^^^^^^^^^^^^^^^^^^^^^');
				//console.log(clickedElementID);
				//console.log('^^^^^^^^^^^^^^^^^^^^^^');			
				if(jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']")).length==0) {
					//console.log('ATTENZIONE! Non è presente in alcuna mappa l\'elemento con codice:\n'+clickedElementID+'\nControllare SVG');
					closeTooltip();
					return true;
				}
			}
			
			//Tooltip data
			jQuery(shadowRoot.querySelectorAll('.tooltip .icon, .tooltip .name, .tooltip .short-description, .tooltip .long-description, .tooltip .lower, .tooltip .view-floorplan, .tooltip .website, .tooltip .share-element, .tooltip .expand-info')).addClass('hide');
			if(icon_code==''&&name==''&&shortdesc==''&&longdesc=='') {
				//console.log('ATTENZIONE! Nessuna informazione per l\'elemento cliccato:\n'+elementCode+'\nControllare il foglio Google');
				closeTooltip();
				return true;
			} else {
				//$(".tooltip .view-floorplan").text(getTranslation($(".tooltip .view-floorplan").text()));
				if(icon_code!='') {
					////console.log('----------------elementCode');
					////console.log(elementCode);
					jQuery(shadowRoot.querySelectorAll(".tooltip .icon")).removeClass().addClass('icon');
					if(type=='building') {
						jQuery(shadowRoot.querySelectorAll(".tooltip .icon")).addClass(icon_code);
						jQuery(shadowRoot.querySelectorAll(".tooltip .icon")).text(elementCode);
					} else {
						jQuery(shadowRoot.querySelectorAll(".tooltip .icon")).addClass('icon-room');
						jQuery(shadowRoot.querySelectorAll(".tooltip .icon")).html("<img src='"+icon_code+"' />");
					}				
				} else {
					jQuery(shadowRoot.querySelectorAll(".tooltip .icon")).removeClass().addClass("icon").html("");
					if(typeof building !== 'undefined' && building !== null) {
						jQuery(shadowRoot.querySelectorAll(".tooltip .icon")).addClass("building-"+building);
						jQuery(shadowRoot.querySelectorAll(".tooltip .icon")).text(building);
					}
				}
				////console.log('---------name');
				////console.log(name);
				if(name!='') {
					jQuery(shadowRoot.querySelectorAll(".tooltip .name")).removeClass('hide');
					jQuery(shadowRoot.querySelectorAll(".tooltip .name")).text(name);
				}
				if(shortdesc!='') {
					jQuery(shadowRoot.querySelectorAll(".tooltip .short-description")).removeClass('hide');
					if(type=='building') {
						jQuery(shadowRoot.querySelectorAll(".tooltip .short-description")).text(shortdesc);
					} else {
						jQuery(shadowRoot.querySelectorAll(".tooltip .short-description")).html(shortdesc);
					}
				}
				if(longdesc!='') {
					jQuery(shadowRoot.querySelectorAll(".tooltip .long-description")).removeClass('hide');
					jQuery(shadowRoot.querySelectorAll(".tooltip .expand-info")).removeClass('hide');
					jQuery(shadowRoot.querySelectorAll(".tooltip .long-description")).text(longdesc);
				}
				if(type=="building") {
					jQuery(shadowRoot.querySelectorAll(".tooltip .lower")).removeClass('hide');
					jQuery(shadowRoot.querySelectorAll(".tooltip .lower .view-floorplan")).removeClass('hide');
					jQuery(shadowRoot.querySelectorAll(".tooltip .lower .view-floorplan")).attr('data-building-code',elementCode);
					var thisFloor = 0;
					if(jQuery(shadowRoot.querySelectorAll("#building_"+elementCode)).data('building-floor')!== 'undefined' && !isNaN(jQuery(shadowRoot.querySelectorAll("#building_"+elementCode)).data('building-floor'))) {
						thisFloor = jQuery(shadowRoot.querySelectorAll("#building_"+elementCode)).data('building-floor');
					}
					jQuery(shadowRoot.querySelectorAll(".tooltip .lower .view-floorplan")).attr('data-building-floor',thisFloor);
				}
				if(type=="room") {
					jQuery(shadowRoot.querySelectorAll(".tooltip .lower")).removeClass('hide');
					jQuery(shadowRoot.querySelectorAll(".tooltip .lower .share-element")).removeClass('hide');
					jQuery(shadowRoot.querySelectorAll(".tooltip .lower .share-element")).attr('data-element-code',elementCode);
					jQuery(shadowRoot.querySelectorAll(".tooltip .room-url")).text(location.origin+location.pathname+'?shared='+elementCode+'&lang='+thisNoiMapsSettingsLang);
					/*if($('body').hasClass('totem') && typeof QRCode !== 'undefined') {
						roomQRCode();
						qrcode.clear(); // clear the code.
						qrcode.makeCode(location.origin+location.pathname+'?shared='+elementCode+'&lang='+thisNoiMapsSettingsLang); // make another code.
						//new QRCode(document.getElementById("room-qrcode"), location.origin+location.pathname+'?shared='+elementCode+'&lang='+thisNoiMapsSettingsLang);
					}*/

					if(website) {
						jQuery(shadowRoot.querySelectorAll(".tooltip .lower .website")).removeClass('hide');
						jQuery(shadowRoot.querySelectorAll(".tooltip .lower .website")).attr('href',website);
					}
				}
				jQuery(shadowRoot.querySelectorAll(".tooltip")).fadeIn(function() {});
				jQuery(shadowRoot.querySelectorAll(".tooltip")).addClass('active');
			}
			setTooltipPosition();
			tooltipViewport();
		}
	}
}

/*function getOffsetPosition($this, $el) {
    var rect = $this[0].getBoundingClientRect();
    var win = $this[0].ownerDocument.defaultView;

    var elW = $el.width();
    var elH = $el.height();
    var marginB = 20;
    return {
         top: rect.top + win.pageYOffset - (elH + marginB),
         left: rect.left + win.pageXOffset - (elW/2)
    };
}*/

function setTooltipPosition() {
	let currentMediaQuery = jQuery(shadowRoot.querySelectorAll(jsMediaQueryTester)).outerWidth();
	if(jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']")).length>0) {

		let jsElem = jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']"))[0];
		if(jQuery(shadowRoot.querySelectorAll(".inner-map-component")).attr('data-building')!=='axonometric') {
			jsElem = jQuery(shadowRoot.querySelector("[id='"+clickedElementID+"']")).children()[0];
		}

		if(currentMediaQuery >= 50){
			/*jQuery(shadowRoot.querySelectorAll(".tooltip")).css({
				left: jQuery(jsElem).offset().left + (jsElem.getBoundingClientRect().width/2),
				top: jQuery(jsElem).offset().top + (jsElem.getBoundingClientRect().height/2)-8
			});*/
			jQuery(shadowRoot.querySelectorAll(".tooltip")).css({
				left: jQuery(jsElem).offset().left + (jsElem.getBoundingClientRect().width/2) - jQuery(document.querySelectorAll("map-view")).position().left,
				top: jQuery(jsElem).offset().top - document.querySelectorAll("map-view")[0].offsetTop + (jsElem.getBoundingClientRect().height/2)-8
			});

			/*jQuery(shadowRoot.querySelectorAll(".tooltip")).css({
				top: getOffsetPosition(jQuery(shadowRoot.querySelectorAll(".inner-map-component svg")), jQuery(jsElem)).top - document.querySelectorAll("map-view")[0].offsetTop + (jsElem.getBoundingClientRect().height/2)-8,
				left: getOffsetPosition(jQuery(shadowRoot.querySelectorAll(".inner-map-component svg")), jQuery(jsElem)).left + (jsElem.getBoundingClientRect().width/2) - jQuery(document.querySelectorAll("map-view")).position().left,
			});*/

		} else {
			jQuery(shadowRoot.querySelectorAll(".tooltip")).css({
				left: (jQuery(jsElem).offset().left + (jsElem.getBoundingClientRect().width/2))-15 - jQuery(document.querySelectorAll("map-view")).position().left,
				top: (jQuery(jsElem).offset().top - document.querySelectorAll("map-view")[0].offsetTop + (jsElem.getBoundingClientRect().height/2))-45
			});
		}
	}
}

function tooltipViewport(){
	jQuery(shadowRoot.querySelectorAll('.tooltip .card')).removeClass('overflow-right');
	jQuery(shadowRoot.querySelectorAll('.tooltip .card')).removeClass('overflow-bottom');

	if(jQuery(shadowRoot.querySelectorAll('.tooltip')).hasClass('active')) {
		if( (jQuery(shadowRoot.querySelectorAll('.tooltip')).position().left+jQuery(shadowRoot.querySelectorAll('.tooltip .card')).outerWidth()) > jQuery(shadowRoot.querySelectorAll('.inner-map-component')).innerWidth()) {
			jQuery(shadowRoot.querySelectorAll('.tooltip .card')).addClass('overflow-right');
		}
		if( (jQuery(shadowRoot.querySelectorAll('.tooltip')).position().top+jQuery(shadowRoot.querySelectorAll('.tooltip .card')).outerHeight()) > jQuery(shadowRoot.querySelectorAll('.inner-map-component')).innerHeight()) {
			jQuery(shadowRoot.querySelectorAll('.tooltip .card')).addClass('overflow-bottom');
		}
	}
}

function closeTooltip(ev) {
	//console.log('CHIUDO');
	var fadeSpeed = 200;
	if(typeof(ev)!='undefined' && ev!='' && ev!=null) {
		//Close popup only if : popup is active, element clicked parents are not clickable elements, element clicked is not tooltip or element clicked parents is not tooltip
		if(
			jQuery(shadowRoot.querySelectorAll('.tooltip')).hasClass('active') &&
			jQuery(ev.target).parents('.clickable').length==0 &&
			!jQuery(ev.target).hasClass('tooltip') && jQuery(ev.target).parents('.tooltip').length==0
		) {
			jQuery(shadowRoot.querySelectorAll('.tooltip')).fadeOut(fadeSpeed, function() { jQuery(shadowRoot.querySelectorAll('.tooltip')).removeClass('active').html(originalTooltip); });
		}
	} else {
		jQuery(shadowRoot.querySelectorAll('.tooltip')).fadeOut(fadeSpeed, function() {
			jQuery(shadowRoot.querySelectorAll('.tooltip')).removeClass('active').html(originalTooltip);
		});
	}
}

function drawRoomsCategoryIcons() {
	if(typeof(selettoriType)!='undefined' && selettoriType != null && selettoriType!='') {
		var currentBuilding = jQuery(shadowRoot.querySelectorAll('.inner-map-component')).attr('data-building');
		if(currentBuilding == 'axonometric') {
			return;
		}
			
		jQuery(shadowRoot.querySelectorAll("#map .clickable")).each(function(i) {
			let thisElement = jQuery(this);
			let elementCode = thisElement.attr('id');
			let labelSVG = '';

			//Elemento teleport tipo pallino parcheggi - non stampare etichetta
			if( typeof thisElement.data("building-code") !== 'undefined' ) {
				return;
			}

			if(
				typeof NOIrooms[elementCode] !== 'undefined' && NOIrooms[elementCode]!=null &&
				typeof NOIrooms[elementCode]['type'] !== 'undefined' && NOIrooms[elementCode]['type']!=null &&
				typeof selettoriType[NOIrooms[elementCode]['type']] !== 'undefined' && selettoriType[NOIrooms[elementCode]['type']]!==null &&
				typeof selettoriType[NOIrooms[elementCode]['type']]['image'] !== 'undefined' && selettoriType[NOIrooms[elementCode]['type']]['image']!==null
			) {
				let labelSVGUrl = selettoriType[NOIrooms[elementCode]['type']]['image'];
				let x = 0;
				let y = 0;
				let bbox = thisElement[0].getBBox();
				let svgElementWidth = bbox.width/2 > 150 ? 150 : bbox.width/2;
				let svgElementHeight = bbox.height/2 > 150 ? 150 : bbox.height/2;

				var el = document.createElementNS('http://www.w3.org/2000/svg', 'image');
				el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', labelSVGUrl);
				el.setAttributeNS(null, 'width', svgElementWidth);
				el.setAttributeNS(null, 'height', svgElementHeight);
				el.setAttributeNS(null, 'x', bbox.x + (bbox.width/2) - (svgElementWidth / 2));
				el.setAttributeNS(null, 'y', bbox.y + (bbox.height/2) - (svgElementHeight / 2));
				thisElement[0].appendChild(el);
				thisElement.attr('data-category',NOIrooms[elementCode]['type']);

				if( jQuery(shadowRoot.querySelectorAll(".filter-container .single-filter input[data-category='"+NOIrooms[elementCode]['type']+"']")).length > 0 ) {
					if( !jQuery(shadowRoot.querySelectorAll(".filter-container .single-filter input[data-category='"+NOIrooms[elementCode]['type']+"']")).is(':checked') ) {
						thisElement.find('image').hide();
					}
				}

				//printElementOnMap( thisElement, elementCode, jQuery(selettoriType[NOIrooms[elementCode]['type']]['image']) );	
			} else {
				let textLabel = "A000000";
				if(
					typeof NOIrooms[elementCode] !== 'undefined' && NOIrooms[elementCode]!=null &&
					typeof NOIrooms[elementCode]['room_label'] !== 'undefined'
				) {
					textLabel = NOIrooms[elementCode]['room_label'];
				} else {
					textLabel = elementCode;
				}
				printElementOnMap( thisElement, elementCode, jQuery('<svg class="label-room" id="map_floorplan_label" data-name="map floorplan label" xmlns="http://www.w3.org/2000/svg" width="230" height="69.7" viewBox="0 0 230 69.7"> <rect id="Rectangle" width="230" height="69.7" rx="17.4" fill="#fff"/> <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="30" fill="#000" font-family="Arial">'+textLabel+'</text></svg>') );				
			}
		});
		
	}
}

function printElementOnMap(thisElement, elementCode, thisSVG) {
	
	shadowRoot.querySelectorAll('#map svg').innerHTML += '';
	let x = 0;
	let y = 0;
	let thisSVGWidth = thisSVG.attr('width');
	let thisSVGHeight = thisSVG.attr('height');

	if(typeof(thisSVGWidth)=='undefined' || thisSVGWidth==null || thisSVGWidth == '') {
		thisSVGWidth = '30';
	}
	if(typeof(thisSVGHeight)=='undefined' || thisSVGHeight==null || thisSVGHeight == '') {
		thisSVGHeight = '30';
	}
	let svgElement = jQuery(shadowRoot.querySelector("[id='"+elementCode+"']"))[0];

	if(thisSVGWidth>(svgElement.getBBox().width*0.75)) {
		thisSVG.attr('width',svgElement.getBBox().width*0.75);
		x = (svgElement.getBBox().x + (svgElement.getBBox().width/2)) - (thisSVG.attr('width')/2);
	} else {
		x = (svgElement.getBBox().x + (svgElement.getBBox().width/2)) - (thisSVGWidth/2);
	}

	if(thisSVGHeight>(svgElement.getBBox().height*0.75)) {
		thisSVG.attr('height',svgElement.getBBox().height*0.75);
		y = (svgElement.getBBox().y + (svgElement.getBBox().height/2)) - (thisSVG.attr('height')/2);
	} else {
		y = (svgElement.getBBox().y + (svgElement.getBBox().height/2)) - (thisSVGHeight/2);
	}
	
	//y = (svgElement.getBBox().y + (svgElement.getBBox().height/2)) - (thisSVGHeight/2);
	thisSVG.attr('x',x);
	thisSVG.attr('y',y);
	thisElement.append(thisSVG);
}

function goToBuildingFloor(buildingCode, buildingFloor, close = true) {
	if(
		typeof(buildingCode)!=='undefined' && buildingCode!==null && buildingCode!=='' &&
		typeof(buildingFloor)!=='undefined' && buildingFloor!==null && buildingFloor!=='' &&
		typeof(maps_svgs)!=='undefined' && maps_svgs!==null && maps_svgs!==''
	) {
		//console.group("goToBuildingFloor");
		//console.log('--------------');
		//console.log('goToBuildingFloor '+buildingCode+' '+buildingFloor+' close '+close);
		//console.log('--------------');
		//console.groupEnd();

		//Check if requested building and requested floor are keys of maps_svgs array

		//if floor 0 is not defined, try with -1
		if(typeof(maps_svgs[buildingCode]) !== 'undefined' && (typeof(maps_svgs[buildingCode]['floors'][buildingFloor])==='undefined' || maps_svgs[buildingCode]['floors'][buildingFloor]===null || maps_svgs[buildingCode]['floors'][buildingFloor]==='')) {
			buildingFloor = -1;
		}


		if(
			typeof(maps_svgs[buildingCode])!=='undefined' && maps_svgs[buildingCode]!==null && maps_svgs[buildingCode]!=='' &&
			typeof(maps_svgs[buildingCode]['floors'][buildingFloor])!=='undefined' && maps_svgs[buildingCode]['floors'][buildingFloor]!==null && maps_svgs[buildingCode]['floors'][buildingFloor]!==''
		) {
			if(close) {
				//console.log('CHIUDO DA goToBuildingFloor con close = true');
				closeTooltip();
			}
			jQuery(shadowRoot.querySelectorAll('#map')).html(maps_svgs[buildingCode]['floors'][buildingFloor]);			
			clickableBehaviour();
			floorsZoomSelector(buildingCode,buildingFloor);
			navBars(buildingCode,buildingFloor);
			drawRoomsCategoryIcons();
			translateElements();
			/*			
			setMapZoom();*/
		}
	}
}


function floorsZoomSelector(buildingCode,buildingFloor) {
	if(
		typeof(buildingCode)!=='undefined' && buildingCode!==null && buildingCode!=='' &&
		typeof(buildingFloor)!=='undefined' && buildingFloor!==null && buildingFloor!==''
	) {
		var selector = jQuery(shadowRoot.querySelectorAll('.floors-zoom-selector'));
		if(buildingCode!='axonometric') {
			selector.find('.floors-selector').removeClass('hide');
			selector.find('.icon-building').addClass('icon-building-'+buildingCode);
			selector.find('.icon-building').text(buildingCode);
			for(var i in maps_svgs) {
				if(i!='axonometric' && i==buildingCode) {
					if(typeof(maps_svgs[i]['floors'])!='undefined' ) {
						var floorsList = selector.find('.floors-list');
						floorsList.empty();
						for(var j in maps_svgs[i]['floors']) {
							//////console.log(j);
							var item = jQuery('<li/>', {
								text: j,
								class: 'clickable floor',
								'data-building-code': buildingCode,
								'data-floor-code': j,
							})
							/* item.addClass('floor');
							item.attr('data-building',buildingCode);
							item.attr('data-floor',j); */
							if(j == buildingFloor) {
								item.addClass('active');
							}
							floorsList.append(item);
						}
					}
				}
			}
			selector.find('.floors-list li')
				.sort((a,b) => jQuery(b).data("floor-code") - jQuery(a).data("floor-code"))
				.appendTo(selector.find('.floors-list'));
			clickableBehaviour();
		} else {
			selector.find('.icon-building').removeClass().addClass('icon-building').empty();
			selector.find('.floors-list').empty();
			selector.find('.floors-selector').addClass('hide');
		}
	}
}

function navBars(buildingCode,buildingFloor) {
	//Breadcrumbs and selectors
	if(
		typeof(buildingCode)!=='undefined' && buildingCode!==null && buildingCode!=='' &&
		typeof(buildingFloor)!=='undefined' && buildingFloor!==null && buildingFloor!==''
	) {
		////console.log('navBars changing body....');
		jQuery(shadowRoot.querySelectorAll('.inner-map-component')).attr('data-building',buildingCode);
		jQuery(shadowRoot.querySelectorAll('.inner-map-component')).attr('data-floor',buildingFloor);
		
		if(buildingCode!='axonometric') {
			jQuery(shadowRoot.querySelectorAll('.inner-map-component')).removeClass('axonometric');
			jQuery(shadowRoot.querySelectorAll(".main-site-title")).addClass("hide");
			jQuery(shadowRoot.querySelectorAll(".navbar-container, .navbar-container *")).removeClass("hide");
			jQuery(shadowRoot.querySelectorAll(".navbar-container .dropdown-trigger, .filters-dropdown.building-select .dropdown-trigger")).text(buildingCode);
			jQuery(shadowRoot.querySelectorAll(".navbar-container .dropdown-list, .filters-dropdown.building-select .dropdown-list")).empty();
			for(var i in maps_svgs) {
				if(i!='axonometric' && i!=buildingCode) {
					jQuery(shadowRoot.querySelectorAll(".navbar-container .dropdown-list, .filters-dropdown.building-select .dropdown-list")).append('<li><a href="#" class="clickable" data-building-code="'+i+'">'+i+'</a></li>');
				}
			}
			clickableBehaviour();
		} else {
			jQuery(shadowRoot.querySelectorAll('.inner-map-component')).addClass('axonometric');
			jQuery(shadowRoot.querySelectorAll(".navbar-container, .navbar-container .site-title")).addClass("hide");
		}
	}
}

function dropdownToggle(){
	jQuery(shadowRoot.querySelectorAll(".dropdown-trigger")).unbind('click');
	jQuery(shadowRoot.querySelectorAll(".dropdown-trigger")).click(function() {
		var thisEl = jQuery(this);
		thisEl.parents('.dropdown').toggleClass('open');
		thisEl.parent().find('.dropdown-list').slideToggle(300);
	});
}
function dropdownSelection(){
	jQuery(shadowRoot.querySelectorAll(".dropdown")).find('.dropdown-list a:not(.clickable)').click(function() {
		var thisEl = jQuery(this);
		var thisElText = thisEl.text();		
		var current = thisEl.parents('.dropdown').find('.dropdown-trigger');
		var currentText = current.text();
		current.text(thisElText);
		thisEl.text(currentText);
	});
}

function sharerBehaviours() {
	jQuery(shadowRoot.getElementById("copy-sharer-url")).click(function() {
		//console.log('cluck');
		var copyText = shadowRoot.getElementById("sharer-url-input");
		copyText.select();
		document.execCommand("copy");

		var originalText = jQuery(shadowRoot.getElementById("copy-sharer-url")).text();
		var copiedText = getTranslation('Copiato!');

		jQuery(shadowRoot.getElementById("copy-sharer-url")).text(copiedText);
		setTimeout(function() {
			jQuery(shadowRoot.getElementById("copy-sharer-url")).text(originalText);
		},1000);
	});
	jQuery(shadowRoot.querySelectorAll('.sharer-container')).click(function(evt) {
		if(typeof(evt)!='undefined' && typeof(evt.target)!='undefined' && !jQuery(evt.target).hasClass('sharer') && !jQuery(evt.target).parents('.sharer').length>0 ) {
			jQuery(shadowRoot.querySelectorAll('.sharer-container')).fadeOut(function() {
				jQuery(shadowRoot.querySelectorAll('.sharer-container')).addClass('hide');
			});
		}
	});
}

function getTranslation(string) {
	if(typeof translations == 'undefined' || translations == null) {
		getTranslations();
		getTranslation(string);
		return;
	}
	for(var i in translations) {
		if(i == string) {
			return translations[i][thisNoiMapsSettingsLang];
		}
	}
	return string;
}

function delay(callback, ms) {
	var timer = 0;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			callback.apply(context, args);
		}, ms || 0);
	};
}

function searchElementsStarter() {
	//console.log('searchElementsStarter');
	jQuery(shadowRoot.querySelectorAll('.search-container .no-results-container p')).text(getTranslation("Nessun risultato"));
	jQuery(shadowRoot.querySelectorAll('.search-container .search')).unbind('keyup');
	/*jQuery(shadowRoot.querySelectorAll('.search-container .search')).keyup(function() {
		//$(".search-container .loader").fadeIn();
	} );*/
	jQuery(shadowRoot.querySelectorAll('.search-container .search')).keyup(delay(function(){		
		var searchFieldVal = jQuery(this).val();
		jQuery(shadowRoot.querySelectorAll('.search-container .no-results-container')).hide();
		searchElements(searchFieldVal);
	}, 250));
}


function searchElements(string) {	
	var founds = [];
	jQuery(shadowRoot.querySelectorAll('.search-container .category-group-container .category-group')).hide();
	jQuery(shadowRoot.querySelectorAll('.search-container .category-group-container .category-group .group-rooms-list li')).hide();
	if(string.length>=minCharsToSearch) {
		if(typeof(NOIrooms)!=='undefined' && NOIrooms !== null) {
			for(var room in NOIrooms) {
				var found = false;
				for(var property in NOIrooms[room]) {
					if(typeof(NOIrooms[room][property])!='undefined') {
						switch(typeof NOIrooms[room][property]) {
							case 'string':
								if(property.toLowerCase() == 'type') {
									break;
								}
								if(NOIrooms[room][property].toLowerCase().indexOf(string.toString().toLowerCase())!=-1) {
									found = true;
								}
							break;
							case 'object':
								let obj = NOIrooms[room][property];

								//check se oggetti con multilingua, guardiamo solo la lingua corrente
								if(typeof obj[thisNoiMapsSettingsLang] !== 'undefined' && obj[thisNoiMapsSettingsLang]!==null) {
									if(typeof obj[thisNoiMapsSettingsLang] == 'string' && obj[thisNoiMapsSettingsLang].toLowerCase().indexOf(string.toString().toLowerCase())!=-1) {
										found = true;
									}
								} else {
									for(var k in obj) {
										if(typeof obj[k] == 'string' && obj[k].toLowerCase().indexOf(string.toString().toLowerCase())!=-1) {
											found = true;
										}
									}
								}
							break;
						}							
					}
				}
				if(found) {
					founds.push(NOIrooms[room]);
				}
			}
		}
	} else {
		jQuery(shadowRoot.querySelectorAll('.search-container .category-group-container .category-group:not(.original)')).show();
		jQuery(shadowRoot.querySelectorAll('.search-container .category-group-container .category-group:not(.original) .group-rooms-list li')).show();
		jQuery(shadowRoot.querySelectorAll('.search-container .no-results-container')).hide();
	}

	//console.group('ELEMENTS FOUND');
	//console.log(founds.length);
	//console.log(founds);
	//console.groupEnd();

	if(founds.length>0) {
		//loadAfterSearch( JSON.stringify(founds) );
		for(var f in founds) {
			if(typeof founds[f]["room_label"] !== 'undefined' && founds[f]["room_label"] !== null) {
				let roomID = cleanupRoomLabel(founds[f]["room_label"]);
				jQuery(shadowRoot.querySelectorAll('.search-container .category-group-container .category-group:not(.original) .group-rooms-list li[data-room-code="'+roomID+'"]')).show();
				jQuery(shadowRoot.querySelectorAll('.search-container .category-group-container .category-group:not(.original) .group-rooms-list li[data-room-code="'+roomID+'"]')).closest('.category-group').show();
			}
		}
	} else {
		jQuery(shadowRoot.querySelectorAll('.search-container .no-results-container')).show();
	}

	let visibleElements = 0;
	jQuery(shadowRoot.querySelectorAll('.search-container .category-group-container .category-group:not(.original) .group-rooms-list li')).each(function() {
		if(jQuery(this).is(':visible')) {
			visibleElements++;
		}
	});
	if(visibleElements == 0) {
		jQuery(shadowRoot.querySelectorAll('.search-container .no-results-container')).show();
	} else {
		jQuery(shadowRoot.querySelectorAll('.search-container .no-results-container')).hide();
	}
}

function sidebarHeight() {
	let h = jQuery(shadowRoot.querySelectorAll('.inner-map-component')).outerHeight();

	jQuery(shadowRoot.querySelectorAll('.search-container')).css('height',h);
	jQuery(shadowRoot.querySelectorAll('.option-filter-container')).css('height',h);

	jQuery(shadowRoot.querySelectorAll('.search-container .category-group-container')).css('height', h - jQuery(shadowRoot.querySelectorAll('.search-container .input-container')).outerHeight() );

}

customElements.define('map-view', MapView);