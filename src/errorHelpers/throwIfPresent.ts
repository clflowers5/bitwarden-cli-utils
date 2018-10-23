function throwIfPresent(err: any) {
  if (err) {
    throw new Error(err);
  }
}

export default throwIfPresent;
