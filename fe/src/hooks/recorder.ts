//@ts-ignore
import MyWorker from './transcode.worker'
import CryptoJS from 'crypto-js'

let buffer:any[] = []
interface IASRRecorderCtx {
    app_id: string
    api_key: string
    onStart: (e: any) => void
    onError: (e: any) => void
    onClose: (e: any) => void
    onMessage: (e: any) => void
}

export default class ASRRecorder {
    private config: IASRRecorderCtx
    private state: 'ing' | 'end'
    private appId: string
    private apiKey: string
    private context: AudioContext | undefined
    private recorder: ScriptProcessorNode | undefined
    private mediaStream: MediaStreamAudioSourceNode | undefined
    private ws: WebSocket | undefined
    private handlerInterval: ReturnType<typeof setInterval>
    private recorderWorker;
    private MR: MediaRecorder | undefined;
    // private recorder: MediaRecorder | undefined
    constructor(config: IASRRecorderCtx) {
        this.config = config
        this.state = 'ing'

        if (typeof Worker !== 'undefined') {

            console.log(123123, MyWorker)
            //@ts-ignore
            this.recorderWorker = new MyWorker()

            this.recorderWorker.onmessage = function (e) {
                buffer.push(...e.data.buffer)
            }
        }



        this.appId = config.app_id
        this.apiKey = config.api_key
    }

    async start() {
        this.stop()
        if ((navigator.getUserMedia || navigator.mediaDevices)&& AudioContext) {
            this.state = 'ing'
            if (!this.recorder) {
                var context = new AudioContext()
                this.context = context
                this.recorder = context.createScriptProcessor(0, 1, 1)

                var getMediaSuccess = (stream) => {
                    var mediaStream = this.context.createMediaStreamSource(stream)
                    this.mediaStream = mediaStream
                    this.recorder.onaudioprocess = (e) => {
                        this.sendData(e.inputBuffer.getChannelData(0))
                    }
                    this.connectWebsocket()
                }
                var getMediaFail = (e) => {
                    this.recorder = null
                    this.mediaStream = null
                    this.context = null
                    console.log('请求麦克风失败',e)
                }
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false
                    }).then((stream) => {
                        getMediaSuccess(stream)
                    }).catch((e) => {
                        getMediaFail(e)
                    })
                } else {
                    navigator.getUserMedia({
                        audio: true,
                        video: false
                    }, (stream) => {
                        getMediaSuccess(stream)
                    }, function (e) {
                        getMediaFail(e)
                    })
                }
            } else {
                this.connectWebsocket()
            }

        } else {
            var isChrome = navigator.userAgent.toLowerCase().match(/chrome/)
            console.log(navigator.getUserMedia)
            alert("not suuport")
        }
    }

    stop() {
        this.state = 'end'
        try {
            this.mediaStream.disconnect(this.recorder)
            this.recorder.disconnect()
        } catch (e) {

        }
    }

    sendData(buffer) {
        this.recorderWorker.postMessage({
            command: 'transform',
            buffer: buffer
        })
    }
    // 生成握手参数
    getHandShakeParams() {
        const appId = this.appId
        const secretKey = this.apiKey
        const ts = Math.floor(new Date().getTime() / 1000);//new Date().getTime()/1000+'';
        const signa = CryptoJS.MD5(appId + ts).toString()
        // var signa = hex_md5(appId + ts)//hex_md5(encodeURIComponent(appId + ts));//EncryptUtil.HmacSHA1Encrypt(EncryptUtil.MD5(appId + ts), secretKey);
        const signatureSha = CryptoJS.HmacSHA1(signa, secretKey)
        const signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(signatureSha))
        const exp = "?appid=" + appId + "&ts=" + ts + "&signa=" + signature;
        console.log('sig', exp)
        return exp
    }
    connectWebsocket() {
        var url = 'wss://rtasr.xfyun.cn/v1/ws'
        var urlParam = this.getHandShakeParams()


        url = `${url}${urlParam}`
        this.ws = new WebSocket(url)
        this.ws.onopen = (e) => {
            this.mediaStream.connect(this.recorder)
            this.recorder.connect(this.context.destination)
            setTimeout(() => {
                this.wsOpened()
            }, 500)
            this.config.onStart && this.config.onStart(e)
        }
        this.ws.onmessage = (e) => {
            this.wsOnMessage(e)
        }
        this.ws.onerror = (e) => {
            this.stop()
            console.log("关闭连接ws.onerror");
            this.config.onError && this.config.onError(e)
        }
        this.ws.onclose = (e) => {
            this.stop()
            console.log("关闭连接ws.onclose");
            this.config.onClose && this.config.onClose(e)
        }
    }

    wsOpened() {
        if (this.ws.readyState !== 1) {
            return
        }
        var audioData = buffer.splice(0, 1280)
        this.ws.send(new Int8Array(audioData))
        this.handlerInterval = setInterval(() => {
            // websocket未连接

            if (this.ws.readyState !== 1) {
                clearInterval(this.handlerInterval)
                return
            }

            if (buffer.length === 0) {
                if (this.state === 'end') {
                    this.ws.send("{\"end\": true}")
                    console.log("发送结束标识");
                    clearInterval(this.handlerInterval)
                }
                return false
            }
            var audioData = buffer.splice(0, 1280)
            if (audioData.length > 0) {
                this.ws.send(new Int8Array(audioData))
            }
        }, 40)

    }

    wsOnMessage(e) {
        let jsonData = JSON.parse(e.data)


        if (jsonData.action == "started") {
        } else if (jsonData.action == "result") {
            this.config.onMessage(e.data)
        } else if (jsonData.action == "error") {
            // 连接发生错误
            console.log("出错了:", jsonData);
        }
    }


    ArrayBufferToBase64(buffer) {
        var binary = ''
        var bytes = new Uint8Array(buffer)
        var len = bytes.byteLength
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
    }
}