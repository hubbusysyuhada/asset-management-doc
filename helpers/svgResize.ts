export default (svg: string, size: string) => {
  return svg.replace(new RegExp('(width=").*?(")'), `width="${size}"`).replace(new RegExp('(height=").*?(")'), `height="${size}"`);
}