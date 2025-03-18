export const PromptRevisaoFinalOrtografia = (texto: string, preservarOriginal: boolean = true) => {
  const notaPreservarOriginal = preservarOriginal ? `
Mantenha o texto o mais próximo possível do original, realizando apenas as intervenções estritamente necessárias para eliminar erros ortográficos ou gramaticais, sem modificar estilo, tom ou conteúdo.` : '';

  return (
`Assuma o papel de um revisor experiente e revise o <texto> a seguir, garantindo correção ortográfica e gramatical. Concentre-se nos seguintes aspectos:
- Ortografia correta;
- Gramática precisa;
- Pontuação adequada;
- Construção sintática correta.
${notaPreservarOriginal}
<texto>
${texto}
</texto>`);
};
