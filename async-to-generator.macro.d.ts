declare function AsyncToGenerator<
    Args extends any[],
    T extends Generator = IterableIterator<any>
>(fn: (...args: Args) => Promise<any>): (...args: Args) => T;

export = AsyncToGenerator;
