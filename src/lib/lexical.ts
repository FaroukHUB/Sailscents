/**
 * Construction minimale d'un editorState Lexical (le format attendu par le
 * champ richText de Payload) a partir de simples paragraphes de texte.
 */

type LexicalText = {
  type: 'text'
  version: 1
  text: string
  detail: 0
  format: 0
  mode: 'normal'
  style: ''
}

type LexicalParagraph = {
  type: 'paragraph'
  version: 1
  direction: 'ltr'
  format: ''
  indent: 0
  children: LexicalText[]
}

export function lexicalFromParagraphs(paragraphs: string[]) {
  const children: LexicalParagraph[] = paragraphs.map((text) => ({
    type: 'paragraph',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: text
      ? [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }]
      : [],
  }))

  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children,
    },
  }
}
