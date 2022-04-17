interface Type<T> extends Function {
  new (...args: unknown[]): T;
}

interface Module {
  commands?: Type<Command>[];
}
