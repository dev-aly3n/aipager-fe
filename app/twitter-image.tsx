import { ALT, card, SIZE } from "./_og/card";

export const alt = ALT;
export const size = SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default function Image() {
  return card();
}
