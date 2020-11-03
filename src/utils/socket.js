/**
 * @description websocket
 */

//心跳检测
var heartCheck = {
  timeout: 3000, //每隔三秒发送心跳
  // num: 3,  //3次心跳均未响应重连
  timeoutObj: null,
  reset: function() {
    //接收成功一次推送，就将心跳检测的倒计时重置为30秒
    clearTimeout(this.timeoutObj); //重置倒计时
    this.start();
  },
  start: function() {
    //启动心跳检测机制，设置倒计时30秒一次
    this.timeoutObj = setTimeout(function() {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      var userId = localStorage.getItem("userId");
      if (!userId) {
        return;
      }
      window.socketServer.send(
        JSON.stringify({
          photographerObjectId: "",
          type: "6",
          leavingContent: "",
          photographerId: userId //留言摄影师编号
        })
      ); //给后端发送信息
    }, this.timeout);
  }
  //onopen连接上，就开始start及时，如果在定时时间范围内，onmessage获取到了服务端消息，
  //就重置reset倒计时，距离上次从后端获取消息30秒后，执行心跳检测，看是不是断了。
};

class WebSock {
  
  constructor(path, store) {
    this.ws = null;
    this.store = store;
    this.path = path;
    this.reconnect= {
      lockReconnect: false,//避免重复连接
      timer: ''
    }
  }

  createWSConnect() {
    let _this = this;
    if (typeof WebSocket === "undefined") {
      alert("您的浏览器不支持socket");
    } else {
      return new Promise((resolve, reject) => {
        
        _this.ws = new WebSocket(_this.path);
        // 监听socket连接
        _this.ws.onopen = function() {
          console.log("socket连接成功!!!");
          // window.socketServer = socket;
          resolve(_this.ws);
          //要不要把socket存放在store呢
          _this.store.dispatch('app/toggleSocket',_this.ws)
          //心跳检测启动
          heartCheck.start();
        };

        _this.ws.onclose = function(e) {
          console.log(
            "websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
          );
          console.log(e);
          _this._reconnect(_this.path);
        };

        // 监听socket错误信息
        _this.ws.onerror = function() {
          _this.ws.close();
          reject();
          console.log("连接错误");
          _this._reconnect(_this.path);
        };
        // 监听socket消息，后端给到前端的数据
        _this.ws.onmessage = function(res) {
          console.log(res);
          if (res.data == 1) {
            //检测心跳
            heartCheck.reset();
            return;
          }
          var data = res.data;
          console.log('收到消息');
          // _this.store.dispatch('togglePokers',{pokers:data.pokers})
          // _this._updateMsgForType.call(_this, data);
        };
      });
    }
  }

  _reconnect(url) {
    let _this = this
    if (this.reconnect.lockReconnect) return;
    this.reconnect.lockReconnect = true;

    this.reconnect.timer && clearTimeout(this.reconnect.timer);
    //没连接上会一直重连，设置延迟避免请求过多
    this.reconnect.timer = setTimeout(function() {
      _this.createWSConnect(url);
      _this.reconnect.lockReconnect = false;
    }, 4000);
  }

  _updateMsgForType(data) {
    if (data.error) {
      // this.$Toast(data.error);
      console.log(data.error);
      return;
    }
  }

  over() {
    this.ws.close()
  }
}

export default WebSock;
