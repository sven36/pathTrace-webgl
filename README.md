
//tick
initEngine


cocos
entry game.ts
update
laya
entry laya.ts init
update
oasis
entry WebGLEngine.ts create
update

//Laya
render scenemanager assetManager eventSystem 
cocos

//ff的 渲染怎么做 delta每次tick根据时间来做各种操作， 进入后台记得省电 laya是不可见
component update cocos laya都是一个类来处理，oasis放在scene上处理 记得遍历时try catch 某个组件出错不影响其它的



oasis
// 渲染 顶点数据 顶点坐标 纹理坐标 纹理数据 场景管理 资产管理 timer 摄像头 ui管理  input 最后  引擎配置 debug  fps



//path tracer event gc 引用计数 camera

//path update  timer pretime timefunc outtime
//camera update  matraix3d set focus
//context update bindbuffer
//render update invert texture vertexbuffer drawcall
//ui update ?  display update
//fbo reverse



laya tick 
timer 不同模式，速率不一样
帧统计 +1
场景update
component update
预处理 preRender
clear before
渲染3d
渲染2d
后处理post render
destory 顶点数据


、、 cocos的 tick
 是否pause  component 开始update
system update
lateupdate 帧结束的更新
内存回收
postupdate 后处理
dirtyRender ui更新？diff了？
node标记
node数组请客
场景缩放更新
帧数统计+1；

oasis
timer
pool清除
xr update
输入update
component start update
物理 update
component  update
anim update
component late update
gc


bug
    /** 刚启动的时间。由于微信的rAF不标准，传入的stamp参数不对，因此自己计算一个从启动开始的相对时间 */