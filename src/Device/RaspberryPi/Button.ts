import { Gpio } from "pigpio"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"

export class Button {
	private readonly _button: Gpio
	
	private readonly _CHATTERING_THRESHOLD_MSEC = 150
	
	private _preTime = new Date().getTime()
	
	
	
	constructor(pin: number) {
		this._button = new Gpio(pin, {
			mode: Gpio.INPUT,
			pullUpDown: Gpio.PUD_UP,
			edge: Gpio.EITHER_EDGE,
		})
		
		this._button.on("interrupt", (level: number) => {
			if (!this._isButtonOn(level)) return
			this.onbutton()
		})
	}
	
	
	
	public onbutton = () => {}
	
	
	
	private _isChattering(): boolean {
		const nowTime = new Date().getTime()
		if (nowTime - this._preTime < this._CHATTERING_THRESHOLD_MSEC) return true
		
		this._preTime = nowTime
		return false
	}
	
	private _isButtonOn = (level: number): boolean => {
		if (level === 0) return false
		if (this._isChattering()) return false
		// console.log(new Date(), level) // DEBUG:
		return true
	}
	
}
