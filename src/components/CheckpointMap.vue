<template>
  <div class='checkpointmap'>
    <div  id="mapid" style="position:absolute;top:0px;left:0px;width: 100%;height: 100%;">
    <div class="control input-group">    <input type="text" class="form-control input-sm" placeholder="Search">    <span class="input-group-btn">
    	  <button class="btn btn-default btn-sm" type="button">Go!</button>    </span></div>
     </div>
     <div id="sidebar" class="panel panel-default">
       {{ vm.route.name }}
      <p v-for="checkpoint in vm.route.checkpoints">
        {{ checkpoint.spot }}: {{ checkpoint.lat.toFixed(6) }} {{ checkpoint.lon.toFixed(6) }} <button>remove</button>
      </p>

     </div>
  </div>
</template>
<style scoped>
  .control {
    position:absolute;
    margin:10px;
    left:50px;
    z-index: 500;
    width:200px;
  }
  #sidebar {
    position:absolute;
    top: 90px;
    left: 11px;
    z-index: 500;
    width: 250px;
    height: 600px;
    opacity: 1;
  }
</style>
<script>
import leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css'
import 'leaflet-contextmenu'
import io from 'socket.io-client'

let route
let vm = { route: {} }

export default {
  name: 'checkpointmap',
  data: function () {
    return {
      checkpointmap: false,
      vm: vm
    }
  },
  mounted: function () {
    console.log('start')
    let socket = io('http://localhost:3003')
    let L = leaflet
    class Checkpoint {
      constructor (spot, lat, lon) {
        this.spot = spot
        this.lat = lat
        this.lon = lon
      }
    }
    class Route {
      constructor (name) {
        this.name = name
        this.checkpoints = []
      }
    }
    let checkpointIcon = L.icon({
      iconUrl: '/static/flag_finish.png',
      iconSize: [32, 32], // size of the icon
      iconAnchor: [4, 29], // point of the icon which will correspond to marker's location
      popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    })
    const checkpointmap = L.map('mapid', {
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: [
        {
          text: 'Add Checkpoint',
          callback: addCheckpoint
        },
        {
          text: 'Save Route',
          callback: saveRoute
        },
        {
          text: 'Center Map',
          callback: centerMap
        },
        '-',
        {
          text: 'Zoom +',
          icon: '/static/zoom-in.png',
          callback: zoomIn
        },
        {
          text: 'Zoom -',
          icon: '/static/zoom-out.png',
          callback: zoomOut
        },
        '-',
        {
          text: 'Clear Route',
          callback: clearRoute
        }
      ]
    }).setView([51.505, -0.09], 13)
    console.log(checkpointmap)
    route = new Route('London Route')
    vm.route = route
    let markers = []
    function saveRoute () {
      socket.emit('route', route)
    }
    function clearRoute () {
      route = new Route('London Route')
      for (let marker of markers) {
        checkpointmap.removeLayer(marker)
      }
    }
    socket.on('route_response', function (success) {
      if (success) {
        alert('Successfully saved route')
      } else {
        alert('Error saving route')
      }
    })
    function addCheckpoint (e) {
      // Todo: von Server Radius abfragen, in dem Checkpoint erkannt wird, oder Radius an Server senden
      let lat = e.latlng.lat
      let lon = e.latlng.lng
      route.checkpoints.push(
        new Checkpoint(route.checkpoints.length + 1, lat, lon)
      )
      let marker = L.marker([lat, lon], {
        icon: checkpointIcon
      })
        .addTo(checkpointmap)
        .bindPopup('Checkpoint ' + route.checkpoints.length)
        .on('click', function (clickEvent) {
          // alert(e.latlng.lat + ' ' + e.latlng.lng)
        })

      let markerCircle = L.circle([lat, lon], 20, {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.5
      })
        .addTo(checkpointmap)
        .bindPopup('Checkpoint ' + route.checkpoints.length)
      markers.push(marker)
      markers.push(markerCircle)
      L.polyline(route.checkpoints, {color: 'red'}).addTo(checkpointmap)
    }

    function centerMap (e) {
      checkpointmap.panTo(e.latlng)
    }

    function zoomIn (e) {
      checkpointmap.zoomIn()
    }

    function zoomOut (e) {
      checkpointmap.zoomOut()
    }
    L.tileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      {
        maxZoom: 18,
        attribution:
          'Map data &copy <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery � <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
      }
    ).addTo(checkpointmap)
  }
}
</script>
