declare module "*.svg" {
  const content: React.ReactEement<any>;
  export default content;
}

declare module "*.css" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}
