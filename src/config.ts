import { cosmiconfig } from "cosmiconfig"
import { TypeScriptLoader } from "cosmiconfig-typescript-loader"

const CONFIG_FILEPATH = "config.ts"

const InvalidConfigError = Error("Invalid config!")
const NotFoundConfigError = Error("Config not found!")



const ENV_TYPE = ["prod", "dev"] as const
type EnvType = (typeof ENV_TYPE)[number]

const TURN_DIRECTION = [1, -1] as const
type TurnDirection = (typeof TURN_DIRECTION)[number]

const DEVICE_TYPE = [
	"rpi0w",
	"rpi02w",
	"mock",
] as const
type DeviceType = (typeof DEVICE_TYPE)[number]

const BUTTON_ACTION = [
	"random",
	"corner-only",
	"edge-only",
	"parity",
	"non-parity",
	"step2",
	"step3",
	"step4",
	"step5",
	"step6",
	"step7",
] as const
type ButtonAction = (typeof BUTTON_ACTION)[number]



export type Config = {
	BUTTON_ACTION: ButtonAction
	SERVER_PORT: number
	STAND_SERVO_PIN: "default" | number
	ARM_SERVO_PIN: "default" | number
	BUTTON_PIN: "default" | number
	STAND_CORRECT_ANGLE: number
	STAND_TURN_ANGLE: number
	ARM_PULL_ANGLE: number
	ARM_HOLD_ANGLE: number
	ARM_RELEASE_ANGLE: number
	ARM_READY_ANGLE: number
	ARM_PULL_SLEEP_MSEC: number
	SERVO_TURN_SLEEP_MSEC: number
	ENV: EnvType
	DEBUG: boolean
	DEVICE_TYPE: DeviceType
	STAND_TURN_D_MAX_COUNT: number
	STAND_DIRECTION: TurnDirection
	ARM_TURN_X_MAX_COUNT: number
	SERVO_SPEC_ANGLE: number
	SERVO_SPEC_PLUS_MAX: number
	SERVO_SPEC_PLUS_MIN: number
	RPS_LIMITER_RATE: number
	LAST_CORRECT_ORIENTATION: boolean
}



const DEFAULT_CONFIG = {
	BUTTON_ACTION: "random",
	SERVER_PORT: 3001,
	STAND_SERVO_PIN: "default",
	ARM_SERVO_PIN: "default",
	BUTTON_PIN: "default",
	STAND_CORRECT_ANGLE: 0,
	STAND_TURN_ANGLE: 90,
	ARM_PULL_ANGLE: 170,
	ARM_HOLD_ANGLE: 217,
	ARM_RELEASE_ANGLE: 237,
	ARM_READY_ANGLE: 270,
	ARM_PULL_SLEEP_MSEC: 200,
	SERVO_TURN_SLEEP_MSEC: 500,
	ENV: "prod",
	DEBUG: false,
	DEVICE_TYPE: "rpi0w",
	STAND_TURN_D_MAX_COUNT: 2,
	STAND_DIRECTION: -1,
	ARM_TURN_X_MAX_COUNT: 3,
	SERVO_SPEC_ANGLE: 270,
	SERVO_SPEC_PLUS_MAX: 2400,
	SERVO_SPEC_PLUS_MIN: 580,
	RPS_LIMITER_RATE: 4,
	LAST_CORRECT_ORIENTATION: true,
} as const satisfies Config



const isConfig = (config: any): config is Config => {
	return true &&
		BUTTON_ACTION.includes(config?.BUTTON_ACTION) &&
		typeof config?.SERVER_PORT === "number" &&
		(config?.STAND_SERVO_PIN === "default" || typeof config?.STAND_SERVO_PIN === "number") &&
		(config?.ARM_SERVO_PIN === "default" || typeof config?.ARM_SERVO_PIN === "number") &&
		(config?.BUTTON_PIN === "default" || typeof config?.BUTTON_PIN === "number") &&
		typeof config?.STAND_CORRECT_ANGLE === "number" &&
		typeof config?.STAND_TURN_ANGLE === "number" &&
		typeof config?.ARM_PULL_ANGLE === "number" &&
		typeof config?.ARM_HOLD_ANGLE === "number" &&
		typeof config?.ARM_RELEASE_ANGLE === "number" &&
		typeof config?.ARM_READY_ANGLE === "number" &&
		typeof config?.ARM_PULL_SLEEP_MSEC === "number" &&
		typeof config?.SERVO_TURN_SLEEP_MSEC === "number" &&
		ENV_TYPE.includes(config?.ENV) &&
		typeof config?.DEBUG === "boolean" &&
		DEVICE_TYPE.includes(config?.DEVICE_TYPE) &&
		typeof config?.STAND_TURN_D_MAX_COUNT === "number" &&
		TURN_DIRECTION.includes(config?.STAND_DIRECTION) &&
		typeof config?.ARM_TURN_X_MAX_COUNT === "number" &&
		typeof config?.SERVO_SPEC_ANGLE === "number" &&
		typeof config?.SERVO_SPEC_PLUS_MAX === "number" &&
		typeof config?.SERVO_SPEC_PLUS_MIN === "number" &&
		typeof config?.RPS_LIMITER_RATE === "number" &&
		typeof config?.LAST_CORRECT_ORIENTATION === "boolean" &&
		true
}



const loadConfig = async (configFilePath: string): Promise<Config> => {
	// MEMO: configファイルをロード
	let result
	try {
		result = await cosmiconfig("", { loaders: { ".ts": TypeScriptLoader() }}).load(configFilePath)
		if (!result) throw Error()
	} catch (e) {
		// MEMO: !result以外でもエラー発生し得るからこうしてる？
		throw NotFoundConfigError
	}
	
	// MEMO: デフォルト値とマージ
	const config = Object.assign(DEFAULT_CONFIG, result.config)
	if (!isConfig(config)) throw InvalidConfigError
	
	return config
}



const config = await loadConfig(CONFIG_FILEPATH)
export { config }
