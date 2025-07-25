declare module "virtual:cat-files" {
  const catFiles: Record<string, any>;
  export = catFiles;
  export as namespace catFiles;
}

declare module "virtual:page-files" {
  const pageFiles: Record<string, any>;
  export = pageFiles;
  export as namespace pageFiles;
}
