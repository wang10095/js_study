cc.eventManager.addListener({   
    event: cc.EventListener.KEYBOARD,   
    onKeyPressed:  function(keyCode, event){    
        if (keyCode == cc.KEY["home"]) {
            cc.director.pause();
        };
    },  
    onKeyReleased: function(keyCode, event){   
    }  
}, this);  

cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){  
    cc.log("游戏进入后台");
    cc.director.pause();
});  
cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){  
    cc.log("重新返回游戏");
    cc.director.resume();
});  

document.addEventListener("visibilitychange", function() {
  if ( document.visibilityState == "hidden") {
    cc.log( document.visibilityState );
    cc.director.pause();
  }else{
    cc.log( document.visibilityState );
    cc.director.resume();
  }
});




var HelloWorldLayer = cc.Layer.extend({  
    _stuffList: [],      //物品列表  
    _counterLabel: null,     //计数标签  
    _count: 0,       //数量  
    _time: 0,        //时间  
    ctor:function () {  
        this._super();  
        winSize = cc.winSize;  
        //创建计数器  
        this._createCounter();  
        //创建物品  
        this._createStuff();  
        //启动更新,5秒后自动收集全部物品  
        this.scheduleUpdate();  
        return true;  
    },  
  
    onEnter: function()  
    {  
        this._super();  
        cc.eventManager.addListener({  
            event: cc.EventListener.TOUCH_ONE_BY_ONE,  
            onTouchBegan: this.onTouchBegan  
        }, this);  
    },  
  
    //创建计数器  
    _createCounter: function()  
    {  
        //图标  
        var icon = new cc.Sprite(res.Icon_png);  
        icon.setPosition(cc.p(winSize.width - 100, winSize.height - 30));  
        icon.setScale(0.5);  
        this.addChild(icon, 0, 101);  

  
        //计数标签  
        this._counterLabel = new cc.LabelTTF("×" + this._count++, "Arial", 36);  
        this._counterLabel.setAnchorPoint(cc.p(0, 0));  
        this._counterLabel.setPosition(cc.p(icon.getPositionX() + 25, winSize.height - 50));  
        this.addChild(this._counterLabel);  
    },  
  
    //创建物品  
    _createStuff: function()  
    {  
        for(var i=0; i<10; i++)  
        {  
            var width = winSize.width * cc.random0To1();  
            var height = winSize.height/2 * cc.random0To1();  
            var stuff = new cc.Sprite(res.Icon_png);  
            stuff.setPosition(cc.p(width, height));  
            this._stuffList.push(stuff);  
            this.addChild(stuff);  
    
        }  
    },  
  
    onTouchBegan: function(touch, event)  
    {  
        var target = event.getCurrentTarget();  
        var touchPos = touch.getLocation();  
  
        //遍历物品列表，查看是否触摸到物品  
        //是的话从物品列表中移除该物品，并执行收集动作  
        for(var i in target._stuffList)  
        {  
            var stuff = target._stuffList[i];  
            if(target.isCollision(touchPos, stuff))  
            {  
                target._stuffList.splice(i, 1);  
                target.collectAction(stuff);  
            }  
        }  
        return false;  
    },  
  
    //收集动作  
    collectAction: function(stuff)  
    {  
        var scaleBig = new cc.ScaleTo(0.2, 1.2);  
        var moveTo = new cc.MoveTo(1.0, this.getChildByTag(101).getPosition());  
        var scaleSmall = new cc.ScaleTo(1.0, 0.5);  
        var spawn = new cc.Spawn(moveTo, scaleSmall);  
        var callfun = new cc.CallFunc(function()  
        {  
            stuff.removeFromParent();  
            this._counterLabel.setString("×" + this._count++);  
        }, this);  
        var actions = new cc.Sequence(scaleBig, spawn, callfun);  
        stuff.runAction(actions);  
    },  
  
    //点和矩形碰撞检测  
    isCollision: function(point, rect)  
    {  
        //获得矩形的左上角坐标p1和右下角坐标p2  
        var p1 = cc.p(rect.x - rect.width/2, rect.y + rect.height/2);  
        var p2 = cc.p(rect.x + rect.width/2, rect.y - rect.height/2);  
  
        //判断点p的x坐标是否大于p1的x坐标,并且小于p2的x坐标,并且p的y坐标大于p2的y坐标,并且小于p2的y坐标  
        if(point.x > p1.x && point.x < p2.x && point.y > p2.y && point.y < p1.y)  
        {  
            return true;  
        }  
        else  
        {  
            return false;  
        }  
    },  
  
    update: function(dt)  
    {  
        if(this._time < 5)  
        {  
            this._time += dt;  
            return;  
        }  
  
        //5秒后遍历物品列表，收集剩余的物品  
        for(var i in this._stuffList)  
        {  
            var stuff = this._stuffList[i];  
            this.collectAction(stuff);  
            this._stuffList.splice(i, 1);  
        }  
    },  
  
    onExit: function()  
    {  
        this._super();  
        cc.eventManager.removeListener(cc.EventTouch.TOUCH_ONE_BY_ONE);  
    }  
});


// isFlippedX:function(){
//     return this._flippedX;
// }


function People(name)
{
    this.name = name;
    this.Introduce = function(){
        alert("My name is "+this.name);
    }
}
People.Run = function(){
    alert("I can run");
}
People.prototype.IntroduceChinese=function(){
    alert("我的名字是"+this.name);
}

var p1 = new People("Winding");
p1.Introduce();
People.Run();
p1.IntroduceChinese();

extendClass.prototype = new baseClass();
var instance = new extendClass();
var baseinstance = new baseClass();
baseinstance.showMsg.call(instance);

rabbit.__proto__ = animal
extendClass.prototype = new baseClass();
var instance = new extendClass();
instance.showMsg();
baseClass.showMsg.call

cc.eventManager.addListener({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches:true,
    onTouchBegan:this.onTouchBegan,
    onTouchMoved:this.onTouchMoved,
    onTouchEnded:this.onTouchEnded  
},this);

cc.eventManager.addListener({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches:true,
},this);
