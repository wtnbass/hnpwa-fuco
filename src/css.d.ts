interface CSSToString {
  toString(): string;
}
declare module "*.css" {
  const style: CSSToString;
  export default style;
}
