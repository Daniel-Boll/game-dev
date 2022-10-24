import * as w4 from "../wasm4";

export function centeredText(
  text: string,
  y: i32,
  between: i32[] = [0, 160]
): void {
  // const x = (160 - text.length * 8) / 2;
  const textWidth = text.length * 8;
  const x = (between[1] + between[0] - textWidth) / 2;
  w4.text(text, x, y);
}

export function isMouseOver(x: i32, y: i32, width: i32, height: i32): boolean {
  const mouseX = load<i16>(w4.MOUSE_X);
  const mouseY = load<i16>(w4.MOUSE_Y);
  const error = 5;

  return (
    mouseX > x - error &&
    mouseX < y + error &&
    mouseY > width - error &&
    mouseY < height + error
  );
}
