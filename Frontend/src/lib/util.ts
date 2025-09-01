
export const convertMarkdownToHtml = (content: string): string => {
  return content
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^#{1,6}\s+(.*)$/gm, (match, text) => {
      const level = match?.match(/^#+/)?.[0]?.length || 1;
      return `<h${level}>${text}</h${level}>`;
    })
    .replace(/^(\s*)([-*+])\s+(.*)$/gm, (_, indent, _marker, text) => {
      const depth = Math.floor(indent.length / 2);
      return `${'  '.repeat(depth)}<li>${text}</li>`;
    })
    .replace(/^(\s*)(\d+\.)\s+(.*)$/gm, (_, indent, _number, text) => {
      const depth = Math.floor(indent.length / 2);
      return `${'  '.repeat(depth)}<li>${text}</li>`;
    })
    .replace(/\n\n+/g, '</p><p>')
    .replace(/^(?!<[h|p|li|ul|ol|pre])(.*)$/gm, (_, text) => {
      if (text.trim() && !text.startsWith('<')) {
        return `<p>${text}</p>`;
      }
      return text;
    })
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/<\/p><p><\/p><p>/g, '</p><p>')
    .replace(/<\/p><p><\/p><p>/g, '</p><p>')
    .replace(/<p><\/p>/g, '')
    + '\n\n';
};
