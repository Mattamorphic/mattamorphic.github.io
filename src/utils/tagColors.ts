const colors = ["#e57373", "#64b5f6", "#81c784", "#fff176", "#ba68c8"];
const tagColorMap: Record<string, string> = {};

export function generateTagColor(tag: string): string {
  if (!tagColorMap[tag]) {
    const colorIndex = Object.keys(tagColorMap).length % colors.length;
    tagColorMap[tag] = colors[colorIndex];
  }
  return tagColorMap[tag];
}
