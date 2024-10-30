import { config } from "../../config.js"
import type { Device, Servo } from "../Device.js"
import { GeekServo } from "./GeekServo.js"
import { Button } from "./Button.js"
import { log, dbg, dev, AbortableSleep, abortableSleep, sleep, abortSleep, envBoolean, envNumber, generateId, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure, StopWatch, stopWatch } from "../../utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "../../types.js"

export class RPiZeroW implements Device {
	public readonly standServo: Servo
	public readonly armServo: Servo
	
	private readonly _button: Button
	private readonly _abortableSleep: AbortableSleep
	
	private readonly _STAND_SERVO_PIN = config.STAND_SERVO_PIN === "default" ? 14 : config.STAND_SERVO_PIN
	private readonly _ARM_SERVO_PIN = config.ARM_SERVO_PIN === "default" ? 15 : config.ARM_SERVO_PIN
	private readonly _BUTTON_PIN = config.BUTTON_PIN === "default" ? 27 : config.BUTTON_PIN
	
	constructor() {
		this.standServo = new GeekServo(this._STAND_SERVO_PIN)
		this.armServo = new GeekServo(this._ARM_SERVO_PIN)
		
		this._button = new Button(this._BUTTON_PIN)
		this._button.onbutton = () => this.onbutton()
		
		this._abortableSleep = new AbortableSleep()
	}
	
	
	
	// MEMO: dummy
	public async connectWait(): Promise<boolean> {
		this.onconnect()
		return true
	}
	
	// MEMO: dummy
	public isConnected(): boolean {
		return true
	}
	
	
	
	public async sleep(ms: number): Promise<void> {
		await this._abortableSleep.sleep(ms, { throwError: true })
	}
	
	public abortSleep(): void {
		this._abortableSleep.abort()
	}
	
	public resetAbortSleep(): void {
		this._abortableSleep.resetController()
	}
	
	
	
	public emitRun(): void {
		this.onrun()
	}
	
	public emitStop(result: boolean): void {
		this.onstop(result)
	}
	
	
	
	public onconnect: () => Promise<void> = async () => {}
	public onclose: () => Promise<void> = async () => {}
	public onbutton: (button?: string, count?: number) => Promise<void> = async () => {}
	
	public onrun: () => Promise<void> = async () => {}
	public onstop: (result: boolean) => Promise<void> = async (result: boolean) => {}
	
}
