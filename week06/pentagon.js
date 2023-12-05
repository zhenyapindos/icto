let markerVisible = { A: false, B: false, C: false, D: false};

AFRAME.registerComponent('registerevents', {
  init: function () {
    let marker = this.el;
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
    this.p0 = new THREE.Vector3();
    this.p1 = new THREE.Vector3();
    this.p2 = new THREE.Vector3();
    this.p3 = new THREE.Vector3();
    
    this.createCylinderAndLine('AB', '#lineAB');
    this.createCylinderAndLine('BC', '#lineBC');
    this.createCylinderAndLine('CD', '#lineCD');
    this.createCylinderAndLine('DA', '#lineDA');
  },

  createCylinderAndLine: function (cylinderId, lineId) {
    let material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    let geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 12);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));

    this['cylinder' + cylinderId] = new THREE.Mesh(geometry, material);
    this['line' + cylinderId] = document.querySelector(lineId).object3D;
    this['line' + cylinderId].add(this['cylinder' + cylinderId]);
    this['cylinder' + cylinderId].visible = false;
  },

  tick: function (time, deltaTime) {
    if (markerVisible["A"] && markerVisible["B"]) {
      this.A.object3D.getWorldPosition(this.p0);
      this.B.object3D.getWorldPosition(this.p1);
      this.updateCylinderAndLine(this.p0, this.p1, 'AB');
    }
    if (markerVisible["B"] && markerVisible["C"]) {
      this.B.object3D.getWorldPosition(this.p1);
      this.C.object3D.getWorldPosition(this.p2);
      this.updateCylinderAndLine(this.p1, this.p2, 'BC');
    }
    if (markerVisible["C"] && markerVisible["D"]) {
      this.C.object3D.getWorldPosition(this.p2);
      this.D.object3D.getWorldPosition(this.p3);
      this.updateCylinderAndLine(this.p2, this.p3, 'CD');
    }
    if (markerVisible["D"] && markerVisible["A"]) {
      this.D.object3D.getWorldPosition(this.p3);  // Corrected to use D
      this.A.object3D.getWorldPosition(this.p0);  // Corrected to use A
      this.updateCylinderAndLine(this.p3, this.p0, 'DA');
    }
    if (!markerVisible["A"])
      this.hideCylinders(['AB', 'DA']);  // Corrected to use 'DA'
    if (!markerVisible["B"])
      this.hideCylinders(['AB', 'BC']);
    if (!markerVisible["C"])
      this.hideCylinders(['BC', 'CD']);
  },

  updateCylinderAndLine: function (point1, point2, cylinderId) {
    let distance = point1.distanceTo(point2);
    this['line' + cylinderId].lookAt(point2);
    this['cylinder' + cylinderId].scale.set(1, 1, distance);
    this['cylinder' + cylinderId].visible = true;
  },

  hideCylinders: function (cylinderIds) {
    for (let id of cylinderIds) {
      this['cylinder' + id].visible = false;
    }
  }
});
