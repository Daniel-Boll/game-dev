import { Delayer } from "../../utils/utils";
import * as w4 from "../wasm4";

export function toneFrequency(freq1: i32 = 0, freq2: i32 = 0): u32 {
  return freq1 | (freq2 << 16);
}

export function toneDuration(
  attack: i32 = 0,
  decay: i32 = 0,
  sustain: i32 = 0,
  release: i32 = 0
): u32 {
  return (attack << 24) | (decay << 16) | sustain | (release << 8);
}

export function toneVolume(peak: i32 = 0, volume: i32 = 0): u32 {
  return (peak << 8) | volume;
}

export function toneFlags(channel: i32 = 0, mode: i32 = 0, pan: i32 = 0): u32 {
  return channel | (mode << 2) | (pan << 4);
}

const ballHit = [
  toneFrequency(560, 200),
  toneDuration(0, 0, 5, 0),
  toneVolume(76, 28),
  toneFlags(0, 0, 0),
];

const levelNotAvailable = [
  toneFrequency(400, 410),
  toneDuration(0, 0, 10, 0),
  toneVolume(100, 34),
  toneFlags(0, 0, 0),
];

const coinSound = [
  toneFrequency(0, 990),
  toneDuration(0, 12, 4, 0),
  toneVolume(32, 8),
  toneFlags(1, 3, 0),
];

const mapTransitionSound = [
  toneFrequency(90, 310),
  toneDuration(0, 0, 90, 0),
  toneVolume(52, 30),
  toneFlags(0, 3, 0),
];

const menuOptionTransitionSound = [
  toneFrequency(90, 310),
  toneDuration(0, 0, 10, 0),
  toneVolume(52, 30),
  toneFlags(0, 3, 0),
];

const menuOptionSelectionSound = [
  toneFrequency(90, 930),
  toneDuration(0, 0, 10, 25),
  toneVolume(18, 30),
  toneFlags(0, 0, 0),
];

const menuOptionUnavailableSound = [
  toneFrequency(400, 410),
  toneDuration(0, 0, 10, 0),
  toneVolume(100, 34),
  toneFlags(0, 0, 0),
];

const playLevelSelectionSound = [
  toneFrequency(90, 930),
  toneDuration(0, 0, 10, 25),
  toneVolume(18, 30),
  toneFlags(0, 0, 0),
];

const levelEndConfirmationSound = [
  toneFrequency(90, 930),
  toneDuration(0, 0, 10, 25),
  toneVolume(18, 30),
  toneFlags(0, 0, 0),
];

const slowMotionSound = [
  toneFrequency(90, 20),
  toneDuration(0, 30, 5, 61),
  toneVolume(62, 20),
  toneFlags(0, 0, 0),
];

export function playBallHit(): void {
  w4.tone(ballHit[0], ballHit[1], ballHit[2], ballHit[3]);
}

export function playLevelNotAvailable(): void {
  w4.tone(
    levelNotAvailable[0],
    levelNotAvailable[1],
    levelNotAvailable[2],
    levelNotAvailable[3]
  );
}

export function playCoinSound(): void {
  w4.tone(coinSound[0], coinSound[1], coinSound[2], coinSound[3]);
}

export function playMapTransitionSound(): void {
  w4.tone(
    mapTransitionSound[0],
    mapTransitionSound[1],
    mapTransitionSound[2],
    mapTransitionSound[3]
  );
}

export function playMenuOptionTransitionSound(): void {
  w4.tone(
    menuOptionTransitionSound[0],
    menuOptionTransitionSound[1],
    menuOptionTransitionSound[2],
    menuOptionTransitionSound[3]
  );
}

export function playMenuOptionSelection(): void {
  w4.tone(
    menuOptionSelectionSound[0],
    menuOptionSelectionSound[1],
    menuOptionSelectionSound[2],
    menuOptionSelectionSound[3]
  );
}

export function playMenuOptionUnavailable(): void {
  w4.tone(
    menuOptionUnavailableSound[0],
    menuOptionUnavailableSound[1],
    menuOptionUnavailableSound[2],
    menuOptionUnavailableSound[3]
  );
}

export function playLevelSelection(): void {
  w4.tone(
    playLevelSelectionSound[0],
    playLevelSelectionSound[1],
    playLevelSelectionSound[2],
    playLevelSelectionSound[3]
  );
}

export function playLevelEndConfirmation(): void {
  w4.tone(
    levelEndConfirmationSound[0],
    levelEndConfirmationSound[1],
    levelEndConfirmationSound[2],
    levelEndConfirmationSound[3]
  );
}

export function playSlowMotion(): void {
  w4.tone(
    slowMotionSound[0],
    slowMotionSound[1],
    slowMotionSound[2],
    slowMotionSound[3]
  );
}
