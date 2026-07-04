type LexicalNode = { text?: string; children?: LexicalNode[] }

/**
 * Extrait un texte brut approximatif d'un contenu Lexical (Payload richText),
 * utile pour les champs `acceptedAnswer`/`description` des balisages JSON-LD.
 */
export const richTextToPlainText = (data: unknown): string => {
  const root = (data as { root?: LexicalNode })?.root
  if (!root) return ''

  const collect = (node: LexicalNode): string => {
    const own = node.text ?? ''
    const nested = node.children?.map(collect).join(' ') ?? ''
    return [own, nested].filter(Boolean).join(' ')
  }

  return collect(root).trim()
}
