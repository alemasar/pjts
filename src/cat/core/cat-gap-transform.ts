import { extractAllTags } from './utils/utils-parser-functions';

export class CatGapTransform {

  constructor() {

  }
  public parser(gap: string): string {
    const template = extractAllTags(gap, "cat-gap");
    console.log(template);
    return "HELLO WORLD"
  }
}