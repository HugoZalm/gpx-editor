To split a `LineString` in **OpenLayers** using **ol-ext**, you typically rely on the `ol.interaction.Split` interaction provided by ol-ext.

Here’s the core idea: you add a split interaction to your map, specify the source containing your `LineString`, and then draw a geometry (usually a point or another line) to cut it.

### Basic example

```javascript
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {LineString} from 'ol/geom';
import Feature from 'ol/Feature';

// ol-ext
import Split from 'ol-ext/interaction/Split';

// Create a LineString feature
const line = new Feature({
  geometry: new LineString([
    [0, 0],
    [10, 10],
    [20, 0]
  ])
});

const source = new VectorSource({
  features: [line]
});

const vectorLayer = new VectorLayer({
  source: source
});

const map = new Map({
  target: 'map',
  layers: [vectorLayer],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// Add split interaction
const split = new Split({
  source: source
});

map.addInteraction(split);

// Listen to split event
split.on('aftersplit', function (e) {
  console.log('Original feature:', e.feature);
  console.log('New features:', e.features);
});
```

### How it works

* The `Split` interaction watches the given `VectorSource`.
* When you draw a splitting geometry (by default a line), it intersects existing features.
* If it intersects your `LineString`, it replaces it with multiple new `LineString` features.

### Common tweaks

* **Split with a point instead of a line:**

  ```javascript
  const split = new Split({
    source: source,
    type: 'Point'
  });
  ```

* **Only split specific features:**

  ```javascript
  const split = new Split({
    source: source,
    features: new ol.Collection([line])
  });
  ```

* **Styling the sketch (split line):**
  You can pass a `style` option to control how the cutting geometry looks.

### Gotchas

* The split only happens if the geometries actually intersect (within tolerance).
* Coordinates must be in the same projection.
* The original feature is removed and replaced with new ones—so keep references updated.

If you want, I can show how to trigger the split programmatically (without user drawing) or split at a specific coordinate.
