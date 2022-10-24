import { Position } from "./structures";
import { isNumber } from "./utils";

export function circleIntersectsWithRectangle(
  circle: Position<i32>,
  rect: Position<i32>,
  radius: u8,
  width: u8,
  height: u8
): bool {
  const distX = Math.abs(circle.x - rect.x - width / 2);
  const distY = Math.abs(circle.y - rect.y - height / 2);

  if (distX > width / 2 + radius) {
    return false;
  }
  if (distY > height / 2 + radius) {
    return false;
  }

  if (distX <= width / 2) {
    return true;
  }
  if (distY <= height / 2) {
    return true;
  }

  const dx = distX - width / 2;
  const dy = distY - height / 2;
  return dx * dx + dy * dy <= radius * radius;
}

export function vectorNormal<T>(vector: Position<T>): Position<T> {
  if (isNumber<T>()) {
    const length = Math.sqrt(
      // @ts-ignore: The types are correct
      <T>vector.x * <T>vector.x + <T>vector.y * <T>vector.y
    );
    // @ts-ignore: The types are correct
    return { x: <T>(vector.x / length), y: <T>(vector.y / length) };
  }

  return vector;
}

export function reflectVector(
  vector: Position<f32>,
  normal: Position<f32>
): Position<f32> {
  const dot = vector.x * normal.x + vector.y * normal.y;
  return {
    x: vector.x - 2 * dot * normal.x,
    y: vector.y - 2 * dot * normal.y,
  };
}
