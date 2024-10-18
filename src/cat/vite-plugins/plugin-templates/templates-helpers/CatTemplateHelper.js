const breaklinesRegExp = /\r?\n|\r|\n/g

const deleteLineComment = (templateLine) => {
  let resultTemplate = ''
  let startHtml = 0
  let posStartComment = templateLine.indexOf('<!--')

  while (posStartComment !== -1) {
    resultTemplate += templateLine.substring(startHtml, posStartComment)
    startHtml = templateLine.indexOf('-->', posStartComment) + 3
    posStartComment = templateLine.indexOf('<!--', posStartComment + 1)
  }
  resultTemplate += templateLine.substring(startHtml, templateLine.length)

  return templateLine.replace(templateLine, resultTemplate)
}

const deleteComments = (templateCode) => {
  const cleanCode = []
  const code = templateCode.split(breaklinesRegExp)
  let startMultilineComment = false

  code.forEach((templateLine, index) => {
    let startLineIndex = -1
    let endLineIndex = -1
  
    if (templateLine.includes('<!--') === true) {
      startLineIndex = index
      startMultilineComment = true
    } 
    if (templateLine.includes('-->') === true) {
      endLineIndex = index
      startMultilineComment = false
    }
    if (startLineIndex !== -1 && startLineIndex === endLineIndex) {
      const line = templateLine.replace(templateLine, deleteLineComment(templateLine))
      cleanCode.push(line)
    } else if (startMultilineComment === false && templateLine.includes('-->') === false) {
      cleanCode.push(templateLine)
    }
  })
  return cleanCode
}

export default deleteComments
