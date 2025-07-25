
const extractFirstTemplateContent = (input: string): string | null => {
  const openTag = '<template>';
  const closeTag = '</template>';
  let start = input.indexOf(openTag);
  if (start === -1) return null;
  start += openTag.length;

  let depth = 1;
  let i = start;
  while (i < input.length) {
    if (input.startsWith(openTag, i)) {
      depth++;
      i += openTag.length;
    } else if (input.startsWith(closeTag, i)) {
      depth--;
      if (depth === 0) {
        return input.slice(start, i);
      }
      i += closeTag.length;
    } else {
      i++;
    }
  }
  return null; // No matching closing tag found
}

/**
 * Extracts all <template>...</template> blocks (with their children, including nested templates) from a string,
 * but only those whose opening tag contains at least one of the specified attributes.
 * @param input The string to search for template blocks.
 * @param attributes Array of attribute names (e.g., ['#cat-gap', '#import-id'])
 * @returns An array of strings, each containing a full <template>...</template> block.
 */
const extractAllTags = (input: string, tag: string): string[] => {
  const templates: string[] = [];
  let i = 0;
  while (i < input.length) {
    const openTagMatch = input.slice(i).match(new RegExp(`<${tag}[^>]*>`));
    if (!openTagMatch) break;
    const openTag = openTagMatch[0];
    const openTagStart = i + openTagMatch.index!;
    const openTagEnd = openTagStart + openTag.length;
    let depth = 1;
    let j = openTagEnd;

    while (j < input.length && depth > 0) {
      const nextOpen = input.indexOf(tag, j);
      const nextClose = input.indexOf(`</${tag}>`, j);
      if (nextClose === -1) break; // Malformed
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        j = nextOpen + 1;
      } else {
        depth--;
        j = nextClose + `</${tag}>`.length;
      }
    }
    templates.push(input.slice(openTagStart, j));
    i = j;
  }
  return templates;
}


/**
 * Removes all HTML comments (<!-- ... -->) from a string.
 * @param input The string to remove comments from.
 * @returns The string with all HTML comments removed.
 */
const removeHtmlComments = (input: string): string => {
  return input.replace(/<!--([\s\S]*?)-->/g, '');
};

export { extractFirstTemplateContent, extractAllTags, removeHtmlComments };