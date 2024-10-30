import { Gpio } from "pigpio"
import type { Servo } from "../Device.js"
import { z } from "zod"
import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "../../utils.js"

type ServoSpec = {
	angle: number
	pulse: {
		max: number
		min: number
	}
}

export class GeekServo implements Servo {
	public readonly SERVO_SPEC = {
		angle: Number(process.env.SERVO_SPEC_ANGLE) || 270,
		pulse: {
			max: Number(process.env.SERVO_SPEC_PLUS_MAX) || 2400,
			min: Number(process.env.SERVO_SPEC_PLUS_MIN) || 580,
		},
	} as const satisfies ServoSpec
	
	private readonly _TURN_SLEEP_MSEC = Number(process.env.SERVO_TURN_SLEEP_MSEC) || 200
	
	private readonly _servo: Gpio
	
	constructor(pin: number) {
		this._servo = new Gpio(pin, { mode: Gpio.OUTPUT })
	}
	
	
	
	public async turn(angle: number): Promise<void> {
		const duty = this._angle2duty(angle)
		this._servo.servoWrite(duty)
		// log(angle, duty) // DEBUG:
		
		await sleep(this._TURN_SLEEP_MSEC) // MEMO: 補正sleep
	}
	
	
	
	private _validateAngle(angle: number): void {
		z.number()
			.min(0, "Over min angle!")
			.max(this.SERVO_SPEC.angle, "Over max angle!")
			.parse(angle)
	}
	
	private _angle2duty(angle: number): number {
		this._validateAngle(angle)
		
		const pulseRange = this.SERVO_SPEC.pulse.max - this.SERVO_SPEC.pulse.min
		const pulsePerAngle = pulseRange / this.SERVO_SPEC.angle
		const duty = Math.round(this.SERVO_SPEC.pulse.min + angle * pulsePerAngle)
		return duty
	}
	
}
