<template>
  <div>
    <div class="sidebar">
      <img @click="fpsClick" alt="fps" class="buttonClass" title="性能调试" src="../assets/fps.svg">
      <img @click="resetEvent" alt="reset" class="buttonClass" title="复位场景" src="../assets/Reset.svg">
      <img @click="chooseHouse" alt="chooseHouse" class="buttonClass" title="仓库切换" src="../assets/qiehuan.svg">
      <img @click="chooseGoods" alt="chooseGoods" class="buttonClass" title="物品搜索" src="../assets/chooseG.svg">
    </div>
    <div id="container"></div>

    <el-dialog title="仓库选择" :visible.sync="dialogFormVisible" width="30%">
          <el-select v-model="houseId" placeholder="请选择仓库">
            <el-option
              v-for="item in houses"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="choose2">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="物品搜索" :visible.sync="dialogFind" width="30%">
      <el-input v-model="goodsname" placeholder="请输入内容"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFind = false">取 消</el-button>
        <el-button type="primary" @click="findGoods">确 定</el-button>
      </div>
    </el-dialog>

    <el-card class="box-card" id="messageTag">
      <el-descriptions title="货物信息" direction="vertical" :column="4" border>
        <el-descriptions-item label="名称">{{ oneData.goodsName }}</el-descriptions-item>
        <el-descriptions-item label="编号">{{ oneData.goodsSn }}</el-descriptions-item>
        <el-descriptions-item label="所在仓库">{{ oneData.houseName }}{{ oneData.houseSn }}</el-descriptions-item>
        <el-descriptions-item label="所在货架">
          位于{{ oneData.shelfSn }}货架第{{oneData.col}}列第{{oneData.row}}层
        </el-descriptions-item>
        <el-descriptions-item label="所在货位">{{ oneData.binSn }}</el-descriptions-item>
        <el-descriptions-item label="货物数量">{{ oneData.amount }}{{ oneData.unit }}</el-descriptions-item>
        <el-descriptions-item label="载荷">{{ oneData.amount*oneData.unitWeight }}/{{ oneData.maxLoad }}kg</el-descriptions-item>
        <el-descriptions-item label="入库时间">{{ oneData.operationDate }}</el-descriptions-item>
        <el-descriptions-item label="货物备注">{{ oneData.goodsNotes }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>


</template>

<script>
import * as THREE from "_three@0.139.2@three";
import {GLTFLoader} from "_three@0.139.2@three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "_three@0.139.2@three/examples/jsm/controls/experimental/CameraControls";
import Stats from "_three@0.139.2@three/examples/jsm/libs/stats.module";
import {CSS2DObject, CSS2DRenderer} from "_three@0.139.2@three/examples/jsm/renderers/CSS2DRenderer";

let scene;
let camera;
let renderer;
let light;
let amblight;
let pointLight1;
let pointLight2;
let house;
let control
let stats;
let axes;
let composer;//效果组合器对象
let labelRenderer;//CSS2渲染器CSS2DRenderer
let chooseMesh=null;//选择的模型

export default {
  name: "test2",
  data() {
    return {
      width:'',
      height:'',
      positions:[],
      houseId:'',
      dialogFormVisible: false,
      dialogFind:false,
      goodsname:'',
      houses:[],
      obj:[],
      findObj:[],
      messageTag:'',//标注信息标签

      oneData:{},//选中的物体信息
    }
  },
  created() {
    this.chooseHouse();
    window.addEventListener('click',this.choose);

    // scene.add(this.messageTag);//id"messageTag"对应的HTML元素作为three.js标签
  },
  mounted() {
    this.width=document.getElementById("container").clientWidth;
    this.height=document.getElementById("container").clientHeight;
    //console.log('width'+this.width+';height'+this.height)
    // window.addEventListener('click',this.onMouseClick);
    this.threeStart();
  },
  beforeDestroy () {
    clearTimeout()
    try {
      //console.log('销毁')
      scene.clear()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.content = null
      const gl = renderer.domElement.getContext('webgl')
      gl && gl.getExtension('WEBGL_lose_context').loseContext()
    } catch (e) {
      //console.log(e)
    }
  },
  methods: {
    chooseGoods(){
      this.dialogFind = true;
    },
    findGoods(){
      this.dialogFind = false;
      this.resetFind();
      this.findObj=[];
      for(let i=0;i<this.obj.length;i++) {
        if (this.obj[i].name.indexOf(this.goodsname)!==-1) {
          this.findObj.push(this.obj[i])
          this.obj[i].material.color.set(0x00ffff);
        }
      }
      //console.log(this.findObj)
      if(this.findObj.length===0){
        this.$message.error("物品不存在请重新查询");
      }else {
        this.$message.success("物品已高亮");
      }
    },
    choose2(){
      this.dialogFormVisible = false;
      for(let i=0;i<this.obj.length;i++){
        scene.remove(scene.getObjectByName(this.obj[i].name))
      }
      // //console.log(this.obj);
      this.obj=[];
      // //console.log(this.obj);
      this.load();
    },
    load(){
      this.request.get("/house/").then(res=>{
        this.houses=res.data;
      })
      this.request.get("/public/"+this.houseId).then(res=>{
        this.positions=res.data;
        // //console.log(this.positions);
        let Positions=this.positions;
        // //console.log(Positions)
        for(let i=0;i<Positions.length;i++){
          let position = Positions[i];
          this.initObject(position);
        }
        let goods = [];
        scene.traverse(function (obj) {
          if (obj.type === 'Goods') {
            goods.push(obj);
          }
        })
        //循环渲染
        //console.log('场景属性', scene);
        // initObjectSelect(scene,camera,this.outlinePass,goods);
        // this.animation();
        this.obj=goods;
      })
    },
    threeStart(){
      //初始化渲染器
      this.initThree();
      //初始化场景
      this.initScene();
      //初始化相机
      this.initCamera();
      //初始化灯光
      this.initLight();
      //加载场景
      this.initHouse();

      this.load();
      // this.initObject()
      //初始化后期效果通道
      // this.initPass();
      //初始化效果组合器
      // this.initComposer();
      //初始化控件
      this.initControls();

      this.initCSS2DRenderer();
      this.messageTag = this.tag("messageTag");//创建信息标注的标签
      scene.add(this.messageTag);
      //循环渲染
      this.animation();
    },
    initObject(position){
        let geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7); //创建一个立方体几何对象Geometry
        // 材质对象Material
        let material = new THREE.MeshLambertMaterial({
          color: 0xF0CD3F,//材质颜色
        });
        let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        mesh.name=position.goodsName;
        mesh.uuid=position.binSn;
        mesh.type='Goods';
        mesh.position.x=position.positionX;
        mesh.position.z=position.positionY*-1;
        mesh.position.y=position.positionZ+0.35;
        this.obj.push(mesh);
        scene.add(mesh); //网格模型添加到场景中
    },
    initThree(){
      renderer=new THREE.WebGLRenderer({
        antialias:true,
        alpha:true
        //用来解决模型重叠部分不停闪烁问题
        // logarithmicDepthBuffer: true
      });
      renderer.setSize(this.width,this.height);
      renderer.setClearColor(0x39609B);
      renderer.setPixelRatio(window.devicePixelRatio);
      document.getElementById("container").appendChild(renderer.domElement);
      window.addEventListener("resize",this.onWindowResize,false);
    },
    initScene(){
      scene=new THREE.Scene();
    },
    initCamera(){
      camera=new THREE.PerspectiveCamera(
        60,
        this.width/this.height,
        1,10000
      );
      camera.position.set(-8,6,3.5);
      camera.lookAt(0,0,0);
      scene.add(camera);
    },
    chooseHouse(){
      this.dialogFormVisible = true;
    },
    initLight(){
      //添加环境光
      amblight=new THREE.AmbientLight(0xffffff,0.5);
      amblight.position.set(0,0,0);
      scene.add(amblight);
      //添加平行光
      light=new THREE.DirectionalLight(0xffffff,0.3);
      light.position.set(0,200,0);
      scene.add(light);
      //添加点光源
      pointLight1=new THREE.PointLight(0xffffff,0.3);
      pointLight1.position.set(-500,200,0);
      pointLight2=new THREE.PointLight(0xffffff,0.3);
      pointLight2.position.set(500,200,0);
      scene.add(pointLight1);
      scene.add(pointLight2);
    },
    initHouse(){
      house = new THREE.Group();//声明一个组对象，用来添加加载成功的三维场景
      let loader = new GLTFLoader(); //创建一个GLTF加载器
      console.log("开始加载");
      loader.load("/static/house.gltf", function (gltf) {//gltf加载成功后返回一个对象
        console.log('控制台查看gltf对象结构', gltf);
        // // gltf.scene可以包含网格模型Mesh、光源Light等信息，至于gltf.scene是否包含光源，要看.gltf文件中是否有光源信息
        //console.log('gltf对象场景属性', gltf.scene);
        // //把gltf.scene中的所有模型添加到model组对象中
        house.add(gltf.scene);
      })
      scene.add(house);
    },
    initControls(){
      control=new OrbitControls(camera,renderer.domElement);
      //设置相机启动阻尼
      control.enableDamping=true
      control.dampingFactor = 0.5;
      // 视角最小距离
      control.minDistance = 0;
      // 视角最远距离
      control.maxDistance = 100;
      // 最大角度
      control.maxPolarAngle = Math.PI / 2.2;

      stats=new Stats();
      stats.domElement.style.display = 'none';
      stats.setMode(0); // 0: fps, 1: ms
      //统计信息显示在左上角
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      document.getElementById("container").appendChild(stats.domElement);
      // document.body.appendChild(stats.dom)
      // axes=new THREE.AxesHelper(20);
      // scene.add(axes);

    },
    onWindowResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    },
    fpsClick(){
      if (stats.domElement.style.display === 'none')
        stats.domElement.style.display = 'block';
      else
        stats.domElement.style.display = 'none';
    },
    resetEvent(){
      control.reset();
      this.resetFind();
    },
    resetFind(){
      if(this.findObj){
        for(let i=0;i<this.findObj.length;i++) {
          this.findObj[i].material.color.set(0xF0CD3F);
        }
      }
      this.findObj=[];
    },
    animation(){
      requestAnimationFrame( this.animation );
      stats.update();
      this.render();
    },
    render(){
      renderer.clear();
      renderer.render(scene,camera);
      labelRenderer.render(scene, camera); //渲染HTML标签对象
      // //console.log(camera.position);//通过相机控件OrbitControls旋转相机，选择一个合适场景渲染角度
    },

    // initPass() {
    //   //创建选中边框高亮的通道
    //   this.outlinePass = new OutlinePass(new THREE.Vector2(this.width,this.height),scene,camera);
    //   this.outlinePass.edgeStrength=10;//包围线浓度
    //   this.outlinePass.edgeGlow=0.1;//边缘线范围
    //   this.outlinePass.edgeThickness=1;//边缘线浓度
    //   this.outlinePass.pulsePeriod=2;//包围线闪烁频率
    //   this.outlinePass.visibleEdgeColor.set("#29e716")//包围线颜色
    //   this.outlinePass.hiddenEdgeColor.set("#190a05")//遮挡部分的边界线颜色
    // },
    // initComposer() {
    //   this.renderPass = new RenderPass(scene,camera);
    //   composer = new EffectComposer(renderer);
    //   composer.addPass(this.renderPass);
    //   composer.addPass(this.outlinePass);
    // },
    initCSS2DRenderer() {
      labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.domElement.style.position = 'absolute';
// 相对标签原来位置偏移
      labelRenderer.domElement.style.top = '200px';//信息弹窗界面高度一半
      labelRenderer.domElement.style.left = '250px';//信息弹窗界面宽度一半
// //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
      labelRenderer.domElement.style.pointerEvents = 'none';
      document.body.appendChild(labelRenderer.domElement);
    },
    tag(domID) {
      let dom = document.getElementById(domID);
      //dom元素包装为CSS2模型对象CSS2DObject
      let label = new CSS2DObject(dom);
      dom.style.pointerEvents = 'none';//避免HTML标签遮挡三维场景的鼠标事件
      // 设置HTML元素标签在three.js世界坐标中位置
      // label.position.set(x, y, z);
      return label;//返回CSS2模型标签
    },
    onMouseClick(event) {
      //以鼠标为点，向场景中发射射线
      let raycaster = new THREE.Raycaster();
//鼠标坐标对象
      let mouse = new THREE.Vector2();

      if (chooseMesh) {
        chooseMesh.material.color.set(0xF0CD3F);// 把上次选中的mesh设置为原来的颜色
        // label.element.style.visibility = 'hidden';//隐藏标签
      }
      //console.log('onMouseClick')
      //console.log(event)
      let x, y;
      x = event.clientX;
      y = event.clientY;
      //canves画布非全屏
      let mainCanvas = document.getElementsByTagName("canvas")[0];
      // let mainCanvas=event.path[0];//火狐不能用
      // //console.log(mainCanvas)
      mouse.x= ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
      mouse.y= -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

      // //屏幕坐标转WebGL标准设备坐标(canves画布全屏）
      // mouse.x= (event.clientX / window.innerWidth) * 2 - 1; //WebGL标准设备横坐标
      // mouse.y= -(event.clientY / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标


      raycaster.setFromCamera(mouse,camera);
      // //console.log(obj)
      let intersects=raycaster.intersectObjects(this.obj);
      // //console.log(intersects)
      if (intersects.length===0){
        chooseMesh = null;
        return
      }
      if (intersects[0].object.type==="Goods"){
        // //console.log(intersects[0].object)
        chooseMesh=intersects[0].object;
        chooseMesh.point = intersects[0].point;
        chooseMesh.material.color.set(0x00ffff);
      }else {
        // //console.log(2)
        chooseMesh = null;
      }
    },
    choose(event) {
      // //console.log('choose')
      // //console.log(event)
      this.onMouseClick(event);//执行射线拾取的代码
      if (chooseMesh) {
        this.request.post("/public/getData",chooseMesh.uuid).then(res=>{
          this.oneData=res.data;
          //console.log(this.oneData)
        })
        // //console.log(chooseMesh)
        this.messageTag.element.style.visibility = 'visible';//显示标签
        // messageTag.position.copy(chooseMesh.getWorldPosition());//通过世界坐标设置标签位置
        this.messageTag.position.copy(chooseMesh.point);//射线在表面拾取坐标
      }
      else {
        this.messageTag.element.style.visibility = 'hidden';
      }
    }
  },


}
</script>

<style scoped>
#container {
  position: absolute;
  width: 99%;
  height:99%;
  overflow: hidden;
  display: block;
}
.sidebar{
  margin-top:100px;
  width: 2%;
  height:400px;
  border-radius:8px;
  text-align:center;
  background: rgba(205, 215, 230, 1);
  right: 10px;
  position: absolute;
  z-index: 1;
}
.buttonClass{
  width: 90%;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.6s; /* 所有属性都变化用all  0.6s过渡*/
  margin-top: 10px;
}
.buttonClass:hover{/*  hover鼠标悬停。按钮缩放1.2*/
  transform: scale(1.2);

}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
</style>
