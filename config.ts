import type { Config } from "./src/Config.js"
export default {
	
	// デバイスボタンの動作
	BUTTON_ACTION: "random",
	
	// Web UIポート番号の指定
	SERVER_PORT: 443,
	
	// デバイスへ接続するサーボモーターの制御ピン指定
	STAND_SERVO_PIN: "default",
	ARM_SERVO_PIN: "default",
	
	// デバイスへ接続するボタンの入力ピン指定
	BUTTON_PIN: "default",
	
	
	
	// サーボモーターの角度微調整
	STAND_CORRECT_ANGLE: 0, // ここでスタンド側サーボモーターの角度を微調整
	STAND_TURN_ANGLE: 90, // ここでスタンド側サーボモーターの角度を微調整
	
	ARM_PULL_ANGLE: 170, // ここでアーム側サーボモーターの角度を微調整
	ARM_HOLD_ANGLE: 217, // ここでアーム側サーボモーターの角度を微調整
	ARM_RELEASE_ANGLE: 237, // ここでアーム側サーボモーターの角度を微調整
	ARM_READY_ANGLE: 270, // ここでアーム側サーボモーターの角度を微調整
	
	ARM_PULL_SLEEP_MSEC: 200, // アーム動作のsleep
	// ARM_PULL_SLEEP_MSEC: 300, // アームの動作が不安定な場合はこちらを使用（ネットワーク重めの環境等）
	
	SERVO_TURN_SLEEP_MSEC: 500, // スタンド、アーム共通のsleep
	// SERVO_TURN_SLEEP_MSEC: 600, // アームの動作が不安定な場合はこちらを使用（ネットワーク重めの環境等）
	
	
	
	// その他環境情報
	ENV: "prod",
	DEBUG: false,
	
	DEVICE_TYPE: "rpi02w", // Raspberry Pi Zero 2 W
	// DEVICE_TYPE: "rpi0w", // Raspberry Pi Zero W
	
	STAND_TURN_D_MAX_COUNT: 2,
	STAND_DIRECTION: -1,
	
	ARM_TURN_X_MAX_COUNT: 3,
	
	SERVO_SPEC_ANGLE: 270,
	SERVO_SPEC_PLUS_MAX: 2400,
	SERVO_SPEC_PLUS_MIN: 580,
	
	RPS_LIMITER_RATE: 4,
	
	LAST_CORRECT_ORIENTATION: false,
	
} as const satisfies Config
