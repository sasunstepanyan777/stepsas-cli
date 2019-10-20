export function getCommandFilePath(command: string): string {
  return `../commands/${command}.command.js`;
}

export function ucFirst(str: string): string {
  if (str && str.length) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}
