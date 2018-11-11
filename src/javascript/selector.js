import { Raycaster, Vector2 } from 'three';

export default class Selector {

  constructor(camera, properties = {}) {
    this._camera = camera;
    this._selection = null;
    this._mouse = new Vector2();
    this._raycaster = new Raycaster();
    this._mouseEnterListeners = [];
    this._mouseLeaveListeners = [];

    this.properties = Object.assign({}, properties);

    this._onMouseMove = this._onMouseMove.bind(this);
    this._attach();
  }

  onMouseEnter(listener) {
    this._mouseEnterListeners.push(listener);
  }

  _fireEvent(object, listeners) {
    listeners.forEach(fn => fn(object));
  }

  onMouseLeave(listener) {
    this._mouseLeaveListeners.push(listener);
  }

  _attach() {
    window.addEventListener('mousemove', this._onMouseMove);
  }

  _onMouseMove(event) {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this._raycaster.setFromCamera(this._mouse, this._camera);

    let intersects = this._raycaster.intersectObjects(this.properties.objects);

    if (intersects.length > 0) {
      if (this._selection != intersects[0].object) {
        if (this._selection) {
          this._fireEvent(this._selection, this._mouseLeaveListeners);
        }

        this._selection = intersects[0].object;
        this._fireEvent(this._selection, this._mouseEnterListeners);
      }
    } else {
      if (this._selection) {
        this._fireEvent(this._selection, this._mouseLeaveListeners);
      }

      this._selection = null;
    }
  }

}