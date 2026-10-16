import { leafletJavaScript, leafletStyle } from "./leaflet-runtime.generated";
import { orientationPoints } from "./references";
import type { Fix, Quest } from "@/domain/quest";
export function mapPayload(quest: Quest | null, fix?: Fix) {
  return {
    type: "config",
    references: orientationPoints,
    route: quest?.route ?? [],
    stations:
      quest?.stations
        .filter((s) => s.point && s.coordinateStatus !== "unverified")
        .map((s) => ({
          order: s.order,
          title: s.title,
          point: s.point,
          radius: s.radius,
        })) ?? [],
    fix: fix && Number.isFinite(fix.accuracy) ? fix : null,
  };
}
export function mapHtml() {
  return `<!doctype html><html lang="de"><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>${leafletStyle}html,body,#map{height:100%;width:100%;margin:0;background:#dce4d4}.leaflet-control-attribution{font-size:9px;max-width:100%;white-space:normal}</style></head><body><div id="map" aria-label="Interaktive OpenStreetMap-Karte"></div><script>${leafletJavaScript}</script><script>
(function(){
 var map=L.map('map').setView([51.869,8.917],15),features=L.layerGroup().addTo(map),position=L.layerGroup().addTo(map),located=false;
 function send(type){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify({type:type}));window.wyldoMapStatus=type;}
 var tileFailed=false;
 var tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
 tiles.on('load',function(){if(!tileFailed)send('tiles-ready');});tiles.on('tileerror',function(){tileFailed=true;send('tiles-error');});
 function point(p){return p&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;}
 function receive(event){try{var d=JSON.parse(event.data);if(d.type!=='config')return;features.clearLayers();position.clearLayers();
  (d.references||[]).forEach(function(s){if(!point(s.point))return;var label=document.createElement('span');label.textContent=s.name+' · OSM-Orientierungspunkt, keine Queststation';L.circleMarker([s.point.latitude,s.point.longitude],{radius:7,color:'#456341',fillColor:'#eeeadd',fillOpacity:1}).addTo(features).bindTooltip(label);});
  (d.stations||[]).forEach(function(s){if(!point(s.point))return;var label=document.createElement('span');label.textContent=s.order+'. '+s.title;L.circleMarker([s.point.latitude,s.point.longitude],{radius:9,color:'#456341',fillOpacity:1}).addTo(features).bindTooltip(label);});
  var route=(d.route||[]).filter(point);if(route.length>1)L.polyline(route.map(function(p){return[p.latitude,p.longitude];}),{color:'#d2b278',weight:5}).addTo(features);
  if(point(d.fix)){L.circle([d.fix.latitude,d.fix.longitude],{radius:Math.max(0,Math.min(1000,d.fix.accuracy||0)),color:'#2a73c5',weight:1}).addTo(position);L.circleMarker([d.fix.latitude,d.fix.longitude],{radius:7,color:'#fff',weight:3,fillColor:'#2a73c5',fillOpacity:1}).addTo(position).bindTooltip('Dein Standort');if(!located){map.panTo([d.fix.latitude,d.fix.longitude]);located=true;}}
 }catch(e){send('configuration-error');}}
 document.addEventListener('message',receive);window.addEventListener('message',receive);send('ready');
})();</script></body></html>`;
}
