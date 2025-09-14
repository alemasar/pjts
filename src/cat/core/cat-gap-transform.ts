import { extractAllTags } from './utils/utils-parser-functions';
const getGapAttributes = (catGap: string) => {
  const catGapArray = catGap.split(/\r?\n|\r/)
  const catGapConfig = catGapArray.shift()
  const gapAttributes = new Map()

  if (catGapConfig) {
    // Extract all characters between # and = from catGapConfig
    const hashToEqualsMatches = catGapConfig.match(/#([^=]+)=/g) || []
    
    // Extract only the characters between # and =
    const charactersBetweenHashAndEquals = hashToEqualsMatches.map(match => {
      const charMatch = match.match(/#([^=]+)=/)
      return charMatch ? charMatch[1] : null
    }).filter(chars => chars !== null)
  
    console.log('Characters between # and =:', charactersBetweenHashAndEquals)
    
    // For each attribute name found, search for its value between =" or =' to " or '
    charactersBetweenHashAndEquals.forEach(attributeName => {
      if (attributeName) {
        // Create regex pattern to match the specific attribute with both quote types
        const attributePattern = new RegExp(`#${attributeName}="([^"]+)"|#${attributeName}='([^']+)'`, 'g')
        const attributeMatches = catGapConfig.match(attributePattern) || []
        
        // Extract the values for this specific attribute
        const attributeValues = attributeMatches.map(match => {
          const doubleQuoteMatch = match.match(new RegExp(`#${attributeName}="([^"]+)"`))
          const singleQuoteMatch = match.match(new RegExp(`#${attributeName}='([^']+)'`))
          
          if (doubleQuoteMatch) {
            return doubleQuoteMatch[1]
          } else if (singleQuoteMatch) {
            return singleQuoteMatch[1]
          }
          return null
        }).filter(value => value !== null)
        gapAttributes.set(attributeName, attributeValues)
        /* attributeValues.forEach(value => {
          console.log(value.replace('[', '').replace(']', '').replace(/"/g, '').replace(/'/g, '').split(', '))
        })
        console.log(`Values for attribute '${attributeName}':`, attributeValues) */
      }
    })
  }
  return gapAttributes
}
export class CatGapTransform {

  constructor() {

  }
  public parser(gap: string): string {
    const gaps = new Map()
    const catGaps = extractAllTags(gap, "cat-gap");
    catGaps.forEach(catGap => {
      // Split by various line break formats: \r\n (Windows), \n (Unix), \r (Mac)
      const catGapArray = catGap.split(/\r?\n|\r/)
      const catGapConfig = catGapArray.shift() as string
      const gapAttributes = getGapAttributes(catGapConfig)
      console.log('gapAttributes Values:::', gapAttributes)
      if (gapAttributes.has('routes') === true) {
        const routes = gapAttributes.get('routes')
        console.log('routes:::', routes)
      }
    })
    console.log(catGaps);
    return "HELLO WORLD"
  }
}