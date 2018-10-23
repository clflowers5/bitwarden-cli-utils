function parseJsonFromString(stringToParse: string): object {
  try {
    return JSON.parse(stringToParse);
  } catch (err) {
    throw new Error(`Failed to parse JSON from subject: ${stringToParse}`);
  }
}

export default parseJsonFromString;
