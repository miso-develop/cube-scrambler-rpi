import chalk from "chalk"

import { Repl } from "./Cli/Repl.js"

import type { DeviceController } from "./Device/DeviceController.js"
import type { ApiController } from "./Api/ApiController.js"
import type { CliController } from "./Cli/CliController.js"

import type { Service } from "./Service.js"
import type { Device, Servo } from "./Device/Device.js"
import type { CubeRobot } from "./CubeRobot/CubeRobot.js"
import type { MoveManager } from "./MoveManager/MoveManager.js"
import type { SequenceGenerator } from "./SequenceGenerator/SequenceGenerator.js"

import { RPiZeroW } from "./Device/RaspberryPi/RPiZeroW.js"
import { GeekServo } from "./Device/RaspberryPi/GeekServo.js"

import { StandServo } from "./CubeRobot/Servo/StandServo.js"
import { ArmServo } from "./CubeRobot/Servo/ArmServo.js"

import { MoveRunner } from "./MoveManager/MoveRunner.js"
import { MoveConverter } from "./MoveManager/MoveConverter/MoveConverter.js"
import { MoveParser } from "./MoveManager/MoveParser.js"

import { CubeRotationSimulator } from "./MoveManager/MoveConverter/CubeRotationSimulator.js"
import { FaceOrientation } from "./MoveManager/MoveConverter/FaceOrientation.js"

import { Min2Phase } from "./SequenceGenerator/Min2Phase.js"
import { CubeChampleApiCache } from "./SequenceGenerator/CubeChampleApi/CubeChampleApiCache.js"
import { StepSequenceGenerator } from "./SequenceGenerator/StepSequenceGenerator.js"

import { CubeChampleApi } from "./SequenceGenerator/CubeChampleApi/CubeChampleApi.js"

import { FaceletsDrawer } from "./Cli/FaceletsDrawer.js"

import { ScrambleDao } from "./Dao/ScrambleDao/ScrambleDao.js"

import { log, dbg, dev, sleep, envBoolean, envNumber, shuffleArray, getYYYYMMDD, getHHMMSS, formatJstDate, random, stoppableFunc, sequenciableFuncs, reverseObject, arrayEquals, timeoutClosure } from "./utils.js"
import { TurnDirection, ArmState, Face, FacePosition, FullFace, FaceLine, CubeState, BASIC_MOVE_LIST, SLICE_MOVE_LIST, WIDE_MOVE_LIST, ROTATION_MOVE_LIST, MOVE_LIST, BasicMove, SliceMove, WideMove, RotationMove, Move, ROBOT_MOVE_LIST, RobotMove, Facelets, Sequence, CubeChampleApiResult, ScrambleData, SCRAMBLE_TYPE, ScrambleType, SCRAMBLE_TYPE_KEYS, SCRAMBLE_TYPE_REVERSE, StepData, ApiServiceFunction, ApiServiceRegistrationFormat, CliServiceFunction, CliServiceRegistrationFormat } from "./types.js"

export class Debugger {
	public static _: any = {}
	
	public static deviceController: DeviceController
	public static apiController: ApiController
	public static cliController: CliController
	
	public static service: Service
	public static device: Device
	public static cubeRobot: CubeRobot
	public static moveManager: MoveManager
	public static sequenceGenerator: typeof SequenceGenerator
	
	public static servo: Servo
	
	public static standServo: StandServo
	public static armServo: ArmServo
	
	public static moveRunner: MoveRunner
	public static moveConverter: typeof MoveConverter
	public static moveParser: typeof MoveParser
	
	public static cubeRotationSimulator: CubeRotationSimulator
	public static faceOrientation: typeof FaceOrientation
	
	public static cubeState: CubeState
	public static robotCubeState: CubeState
	
	public static scrambleDao: ScrambleDao
	
	public static readonly INIT_CUBE_STATE = {
		u: "U",
		r: "R",
		f: "F",
	} as const satisfies CubeState
	
	public static min2Phase: typeof Min2Phase
	public static cubeChampleApiCache: typeof CubeChampleApiCache
	public static stepSequenceGenerator: typeof StepSequenceGenerator
	
	public static cubeChampleApi: typeof CubeChampleApi
	
	
	
	public static setup(
		service: Service,
		deviceController: DeviceController,
		apiController: ApiController,
		cliController: CliController,
	): void {
		this.deviceController = deviceController
		this.apiController = apiController
		this.cliController = cliController
		
		this.service = service
		this.cubeRobot = this.service.cubeRobot
		this.device = this.cubeRobot.device
		this.moveManager = this.service.moveManager
		this.sequenceGenerator = this.service.sequenceGenerator
		
		this.standServo = this.cubeRobot["_standServo"]
		this.armServo = this.cubeRobot["_armServo"]
		
		this.moveRunner = new MoveRunner(this.cubeRobot)
		this.moveConverter = MoveConverter
		this.moveParser = MoveParser
		
		this.cubeState = this.INIT_CUBE_STATE
		this.robotCubeState = this.INIT_CUBE_STATE
		this.cubeRotationSimulator = new CubeRotationSimulator()
		this.faceOrientation = FaceOrientation
		
		this.min2Phase = Min2Phase
		this.cubeChampleApiCache = CubeChampleApiCache
		this.stepSequenceGenerator = StepSequenceGenerator
		
		this.cubeChampleApi = CubeChampleApi
		
		this.setRepl()
	}
	
	
	
	public static async fetchScramble() {
		const scramble = await this.sequenceGenerator.random()
		this._.scramble = scramble
		log({scramble})
		FaceletsDrawer.draw(scramble.facelets)
		return scramble.sequence
	}
	
	
	
	public static async check(type = 0) {
		if (type > 0) dbg({type})
		
		await this.device["_led"](0x110000)
		
		let sequence = ""; sequence = ""
		
		sequence = "R U' R'"
		// sequence = "R U'2 R' U' R U' R'"
		
		// sequence = "U' R2 D R2 F2 D B2 U' B2 D2 R' D2 L2 B' L D' L' U L D2"
		
		
		
		// MEMO: ScrambleSequenceGeneratorでランダム生成
		// sequence = await this.fetchScramble()
		
		// MEMO: ScrambleSequenceGeneratorで生成したsequenceをreverse
		// sequence = moveManager.reverseSequence("U' R2 D R2 F2 D B2 U' B2 D2 R'")
		// sequence = moveManager.reverseSequence(this._.scramble.sequence)
		
		
		
		// MEMO: DEMO
		if (type === 1) sequence = "U' R2 D R2 F2 D B2 U' B2 D2 R'"
		if (type === 2) sequence = this.moveManager.reverseSequence("U' R2 D R2 F2 D B2 U' B2 D2 R'")
		if (type === 3) sequence = await this.fetchScramble()
		if (type === 4) {
			sequence = this.moveManager.reverseSequence(this._.scramble.sequence)
			log(this._.scramble.sequence)
			log(sequence)
		}
		
		
		
		if (sequence !== "") {
			const move = this.moveManager.parseSequence(sequence)
			const robotMove = this.moveManager.convert(move)
			// dbg({move, robotMove})
			
			await this.moveManager.run(robotMove)
		}
		
		await this.device["_led"](0x004400)
	}
	
	
	
	public static stoppableCheck = stoppableFunc(this.check)
	
	public static demo1 = stoppableFunc(() => this.check(1))
	public static demo2 = stoppableFunc(() => this.check(2))
	public static demo3 = stoppableFunc(() => this.check(3))
	public static demo4 = stoppableFunc(() => this.check(4))
	public static demo5 = stoppableFunc(() => this.check())
	public static demos = sequenciableFuncs(this.demo3, this.demo4)
	
	
	
	public static replFunc = {
		"1": async () => await this.cubeRobot.d(1),
		"2": async () => await this.cubeRobot.dp(1),
		
		"3": async () => await this.cubeRobot.x(1),
		
		"4": async () => await this.cubeRobot.y(1),
		"5": async () => await this.cubeRobot.yp(1),
		
		"6": async () => this.armServo.hold(),
		"7": async () => this.armServo.release(),
		"8": async () => await this.cubeRobot.ready(),
		"9": async () => this.armServo["_pull"](),
		
		"0": async () => await this.cubeRobot.init(),
		"-": async () => await this.stoppableCheck(),
		"^": async () => log(this.device.isConnected()),
		"\\": async () => this.deviceController["_deviceService"].onbutton(),
		
		"q": async () => await this.cubeRobot.d(2),
		"w": async () => await this.cubeRobot.dp(2),
		"e": async () => process.exit(),
		"r": async () => {
			await this.cubeRobot.d(1)
			await this.cubeRobot.d(1)
			await this.cubeRobot.x(3)
			await this.cubeRobot.dp(1)
			await this.cubeRobot.x(3)
			await this.cubeRobot.d(1)
			await this.cubeRobot.x(3)
			await this.cubeRobot.dp(1)
			await this.cubeRobot.x(3)
		},
		
		"a": async () => this.demos(),
		"s": async () => {},
		// "d": async () => this.servo.turn(26, 0, 86 + 12),
		// "f": async () => this.servo.turn(26, 0, 86 * 2 + 12),
		
		"z": async () => await this.device["_led"](0x888800),
		"x": async () => await this.device["_led"](0x880088),
		"c": async () => await this.device["_led"](0x008888),
		"v": async () => {
			await this.cubeRobot.x(3)
			await this.cubeRobot.x(3)
			await this.cubeRobot.x(3)
			await this.cubeRobot.x(3)
		},
		
		
		"": async () => {},
	}
	
	public static setRepl() {
		const cliServices = Object.entries(this.replFunc).map(([command, func]) => ({ command, func }))
		Repl.registerCommands(...cliServices)
	}
	
}
