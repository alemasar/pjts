
export interface Route {
  id: string;
  path: string;
}

export interface Template {
  id: string;
  template: string;
}

export interface Page {
  routes: Route;
  templates: Template;
}