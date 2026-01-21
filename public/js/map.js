const mapContainer = document.getElementById("map");

if (mapContainer && typeof coordinates !== "undefined" && coordinates.length === 2) {

  // ⏳ Delay map init so Bootstrap finishes layout
  setTimeout(() => {
    const map = L.map("map").setView(coordinates, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker(coordinates)
      .addTo(map)
      .bindPopup(`<b>${title}</b><br>${locationName}`)
      .openPopup();

    // 🔄 Force Leaflet to recalc size
    map.invalidateSize();

  }, 200);

} else {
  console.error("Map not loaded. Coordinates missing:", coordinates);
}
