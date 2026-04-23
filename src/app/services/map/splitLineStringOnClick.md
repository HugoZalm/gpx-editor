Got it—that’s a different (and simpler) problem. You don’t need full topology libraries like JSTS for this. You’re just **splitting a LineString at a clicked coordinate**, which OpenLayers can handle directly.

---

## 🧩 Concept

1. User selects a line (LineString)
2. User clicks near a **vertex (or segment)**
3. You find the closest point on the line
4. Split the coordinates array into two parts
5. Replace the original feature with two new ones

---

## ✅ Clean approach

### 1. Detect click on the selected feature

```js
map.on('singleclick', function (evt) {
  const feature = select.getFeatures().item(0);
  if (!feature) return;

  const geometry = feature.getGeometry();
  if (geometry.getType() !== 'LineString') return;

  const clickCoord = evt.coordinate;

  splitLineAtCoordinate(feature, clickCoord);
});
```

---

### 2. Split the line

```js
import LineString from 'ol/geom/LineString.js';

function splitLineAtCoordinate(feature, coord) {
  const geometry = feature.getGeometry();
  const coords = geometry.getCoordinates();

  // Find closest segment
  let splitIndex = -1;

  for (let i = 0; i < coords.length - 1; i++) {
    const c1 = coords[i];
    const c2 = coords[i + 1];

    const dist = distanceToSegment(coord, c1, c2);
    if (dist < 10) { // tolerance in map units (adjust!)
      splitIndex = i;
      break;
    }
  }

  if (splitIndex === -1) return;

  // Insert exact split point (optional but cleaner)
  const splitPoint = coord;

  const part1 = coords.slice(0, splitIndex + 1).concat([splitPoint]);
  const part2 = [splitPoint].concat(coords.slice(splitIndex + 1));

  const line1 = new LineString(part1);
  const line2 = new LineString(part2);

  const source = vectorLayer.getSource();

  source.removeFeature(feature);
  source.addFeature(new ol.Feature(line1));
  source.addFeature(new ol.Feature(line2));
}
```

---

### 3. Helper: distance to segment

```js
function distanceToSegment(p, v, w) {
  const l2 = Math.pow(v[0] - w[0], 2) + Math.pow(v[1] - w[1], 2);
  if (l2 === 0) return Math.hypot(p[0] - v[0], p[1] - v[1]);

  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));

  const proj = [
    v[0] + t * (w[0] - v[0]),
    v[1] + t * (w[1] - v[1]),
  ];

  return Math.hypot(p[0] - proj[0], p[1] - proj[1]);
}
```

---

## 🎯 Optional improvements

* **Snap to vertices**
  Add a Snap interaction so clicks lock onto existing points:

  ```js
  import Snap from 'ol/interaction/Snap.js';

  map.addInteraction(new Snap({ source: vectorLayer.getSource() }));
  ```

* **Use closestPoint instead of raw click**

  ```js
  const splitPoint = geometry.getClosestPoint(coord);
  ```

* **Only allow splitting when close enough**
  Prevent accidental splits with a tolerance threshold.

---

## 🧠 UX tip (important)

If you want users to clearly understand this:

* Show vertices (small circles) when line is selected
* Change cursor when hovering a vertex
* Only allow splitting when hovering a valid point

---

## Bottom line

You don’t need heavy geometry libraries here—just:

* detect click
* find nearest segment
* split the coordinate array

If you want, I can help you turn this into a clean reusable “SplitInteraction” class that plugs nicely into your tool toggle system.
