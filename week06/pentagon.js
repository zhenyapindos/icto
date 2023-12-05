let markerVisible = {
  A: false,
  B: false,
  C: false,
  D: false
};

AFRAME.registerComponent('registerevents', {
  init: function () {
    var marker = this.el;
    marker.addEventListener('markerFound', function () {
      markerVisible[marker.id] = true;
    });
    marker.addEventListener('markerLost', function () {
      markerVisible[marker.id] = false;
    });
  }
});

AFRAME.registerComponent('run', {
  init: function () {
    this.A = document.querySelector("#A");
    this.B = document.querySelector("#B");
    this.C = document.querySelector("#C");
    this.D = document.querySelector("#D");

    this.text = document.querySelector("#P");
    this.perimeterText = document.querySelector("#perimeterText");
    this.areaText1 = document.querySelector("#areaText1");
    this.areaText2 = document.querySelector("#areaText2");
    this.areaText3 = document.querySelector("#areaText3");

    this.pA = new THREE.Vector3();
    this.pB = new THREE.Vector3();
    this.pC = new THREE.Vector3();
    this.pD = new THREE.Vector3();

    let material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    let geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 12);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(90)));

    this.cylinderAB = new THREE.Mesh(geometry, material);
    this.lineAB = document.querySelector('#lineAB').object3D;
    this.lineAB.add(this.cylinderAB);
    this.cylinderAB.visible = false;

    this.cylinderBC = new THREE.Mesh(geometry, material);
    this.lineBC = document.querySelector('#lineBC').object3D;
    this.lineBC.add(this.cylinderBC);
    this.cylinderBC.visible = false;

    this.cylinderCD = new THREE.Mesh(geometry, material);
    this.lineCD = document.querySelector('#lineCD').object3D;
    this.lineCD.add(this.cylinderCD);
    this.cylinderCD.visible = false;

    this.cylinderDA = new THREE.Mesh(geometry, material);
    this.lineDA = document.querySelector('#lineDA').object3D;
    this.lineDA.add(this.cylinderDA);
    this.cylinderDA.visible = false;

    this.lineAB = this.createLine();
    this.lineBC = this.createLine();
    this.lineCD = this.createLine();
    this.lineDA = this.createLine();
  },

  createLine: function () {
    let material = new THREE.LineBasicMaterial({ color: 0xFF0000 });
    let geometry = new THREE.BufferGeometry();
    let line = new THREE.Line(geometry, material);
    this.el.sceneEl.object3D.add(line);
    return line;
  },

  tick: function (time, deltaTime) {
    if (markerVisible["A"] && markerVisible["B"] && markerVisible["C"] && markerVisible["D"]) {
      this.A.object3D.getWorldPosition(this.pA);
      this.B.object3D.getWorldPosition(this.pB);
      this.C.object3D.getWorldPosition(this.pC);
      this.D.object3D.getWorldPosition(this.pD);

      // Calculate distances
      let distanceAB = this.pA.distanceTo(this.pB);
      let distanceBC = this.pB.distanceTo(this.pC);
      let distanceCD = this.pC.distanceTo(this.pD);
      let distanceDA = this.pD.distanceTo(this.pA);

      // Calculate perimeter
      let perimeter = distanceAB + distanceBC + distanceCD + distanceDA;

      // Calculate areas of triangles
      let areaABC = calculateTriangleArea(this.pA, this.pB, this.pC);
      let areaBCD = calculateTriangleArea(this.pB, this.pC, this.pD);
      let areaCDA = calculateTriangleArea(this.pC, this.pD, this.pA);

      // Update text entities
      this.perimeterText.setAttribute('text', 'value: Perimeter: ' + perimeter.toFixed(2));
      this.areaText1.setAttribute('text', 'value: Area (ABC): ' + areaABC.toFixed(2));
      this.areaText2.setAttribute('text', 'value: Area (BCD): ' + areaBCD.toFixed(2));
      this.areaText3.setAttribute('text', 'value: Area (CDA): ' + areaCDA.toFixed(2));

      // Update cylinder scales and visibility
      this.cylinderAB.scale.set(1, 1, distanceAB);
      this.cylinderBC.scale.set(1, 1, distanceBC);
      this.cylinderCD.scale.set(1, 1, distanceCD);
      this.cylinderDA.scale.set(1, 1, distanceDA);

      this.cylinderAB.visible = this.cylinderBC.visible = this.cylinderCD.visible = this.cylinderDA.visible = true;
    } else {
      // Hide cylinders if markers are not visible
      this.cylinderAB.visible = this.cylinderBC.visible = this.cylinderCD.visible = this.cylinderDA.visible = false;
    }
  }
});

function calculateTriangleArea(point1, point2, point3) {
  // Use Heron's formula to calculate the area of a triangle
  let a = point1.distanceTo(point2);
  let b = point2.distanceTo(point3);
  let c = point3.distanceTo(point1);
  let s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
