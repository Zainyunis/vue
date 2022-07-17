

import * as THREE from "_three@0.139.2@three";
import $ from 'jquery'

//以鼠标为点，向场景中发射射线
let raycaster = new THREE.Raycaster();
//鼠标坐标对象
let mouse = new THREE.Vector2();
//用来存储射线照射到的几何体对象
let selectObjects=[];
let scene,camera;
let outlinePass;
let obj;
let chooseMesh=null;
export const initObjectSelect=(_scene,_camera,_outlinePass,_obj)=>{
  scene=_scene;
  camera=_camera;
  outlinePass=_outlinePass;
  obj=_obj;
  window.addEventListener('click',onMouseClick);
  // window.addEventListener('dblclick',onMouseDbClick);
  return chooseMesh;
}
function onMouseClick(event) {
  if (chooseMesh) {
    chooseMesh.material.color.set(0xF0CD3F);// 把上次选中的mesh设置为原来的颜色
    // label.element.style.visibility = 'hidden';//隐藏标签
  }
  var x, y;
  x = event.clientX;
  y = event.clientY;
  var mainCanvas=event.path[0]
  mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
  mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;
  raycaster.setFromCamera(mouse,camera);
  // //console.log(obj)
  var intersects=raycaster.intersectObjects(obj);

  if (intersects.length===0){
    //console.log('0')
    $('#label').attr("style","display:none;")//隐藏标签
    selectObjects.pop();
    outlinePass.selectedObjects=selectObjects;
    chooseMesh = null;

  }
  if (intersects[0].object.type==="Goods"){
    chooseMesh=intersects[0].object;
    chooseMesh.material.color.set(0x00ffff);
  }else {
    //console.log(2)
    chooseMesh = null;
  }

}
