// module.d.ts
declare module 'virtual:*' {
  // eslint-disable-next-line
  const gap: any;
  export default gap;
}

declare module "*.json" {
  const value: any;
  export default value;
}