let markerVisible = {
  A: false,
  B: false,
  C: false,
  D: false,
  E: false
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
    this.E = document.querySelector("#F");

    this.text = document.querySelector("#P");
    this.perimeterText = document.querySelector("#perimeterText");
    this.areaText1 = document.querySelector("#areaText1");
    this.areaText2 = document.querySelector("#areaText2");
    this.areaText3 = document.querySelector("#areaText3");
    this.areaText4 = document.querySelector("#areaText4");

    this.pA = new THREE.Vector3();
    this.pB = new THREE.Vector3();
    this.pC = new THREE.Vector3();
    this.pD = new THREE.Vector3();
    this.pE = new THREE.Vector3();

    let material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    let geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 12);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(90)));

    this.cylinderAB = new THREE.Mesh(geometry, material);
    this.lineAB = document.querySelector('#lineAB').object3D;
    this.lineAB.add(this.cylinderAB);
    this.cylinderAB.visible = false;

    this.cylinderBC = new THREE.Mesh(geometry, material);
    this.lineBC = document.querySelector('#lineBF').object3D;
    this.lineBC.add(this.cylinderBC);
    this.cylinderBC.visible = false;

    this.cylinderCD = new THREE.Mesh(geometry, material);
    this.lineCD = document.querySelector('#lineFD').object3D;
    this.lineCD.add(this.cylinderCD);
    this.cylinderCD.visible = false;

    this.cylinderDE = new THREE.Mesh(geometry, material);
    this.lineDE = document.querySelector('#lineDC').object3D;
    this.lineDE.add(this.cylinderDE);
    this.cylinderDE.visible = false;

    this.cylinderEA = new THREE.Mesh(geometry, material);
    this.lineEA = document.querySelector('#lineCA').object3D;
    this.lineEA.add(this.cylinderEA);
    this.cylinderEA.visible = false;
    
    this.lineAB = this.createLine();
    this.lineBF = this.createLine();
    this.lineFD = this.createLine();
    this.lineDC = this.createLine();
    this.lineCA = this.createLine();
  },

  createLine: function () {
    let material = new THREE.LineBasicMaterial({ color: 0xFF0000 });
    let geometry = new THREE.BufferGeometry();
    let line = new THREE.Line(geometry, material);
    this.el.sceneEl.object3D.add(line);
    return line;
  },

  tick: function (time, deltaTime) {
    if (markerVisible["A"] && markerVisible["B"] && markerVisible["F"] && markerVisible["D"]) {
      this.A.object3D.getWorldPosition(this.pA);
      this.B.object3D.getWorldPosition(this.pB);
      this.C.object3D.getWorldPosition(this.pC);
      this.D.object3D.getWorldPosition(this.pD);
      this.E.object3D.getWorldPosition(this.pE);

      // Calculate distances
      let distanceAB = this.pA.distanceTo(this.pB);
      let distanceBC = this.pB.distanceTo(this.pC);
      let distanceCD = this.pC.distanceTo(this.pD);
      let distanceDE = this.pD.distanceTo(this.pE);
      let distanceEA = this.pE.distanceTo(this.pA);

      // Calculate perimeter
      let perimeter = distanceAB + distanceBC + distanceCD + distanceDE + distanceEA;

      // Calculate areas of triangles
      let areaABF = calculateTriangleArea(this.pA, this.pB, this.pC);
      let areaBCD = calculateTriangleArea(this.pB, this.pC, this.pD);
      let areaCDE = calculateTriangleArea(this.pC, this.pD, this.pE);
      let areaDEA = calculateTriangleArea(this.pD, this.pE, this.pA);

      // Update text entities
      this.perimeterText.setAttribute('text', 'value: Perimeter: ' + perimeter.toFixed(2));
      this.areaText1.setAttribute('text', 'value: Area (ABF): ' + areaABF.toFixed(2));
      this.areaText2.setAttribute('text', 'value: Area (BCD): ' + areaBCD.toFixed(2));
      this.areaText3.setAttribute('text', 'value: Area (CDE): ' + areaCDE.toFixed(2));
      this.areaText4.setAttribute('text', 'value: Area (DEA): ' + areaDEA.toFixed(2));

      // Update cylinder scales and visibility
      this.cylinderAB.scale.set(1, 1, distanceAB);
      this.cylinderBC.scale.set(1, 1, distanceBC);
      this.cylinderCD.scale.set(1, 1, distanceCD);
      this.cylinderDE.scale.set(1, 1, distanceDE);
      this.cylinderEA.scale.set(1, 1, distanceEA);

      this.cylinderAB.visible = this.cylinderBC.visible = this.cylinderCD.visible = this.cylinderDE.visible = this.cylinderEA.visible = true;
    } else {
      // Hide cylinders if markers are not visible
      this.cylinderAB.visible = this.cylinderBC.visible = this.cylinderCD.visible = this.cylinderDE.visible = this.cylinderEA.visible = false;
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
