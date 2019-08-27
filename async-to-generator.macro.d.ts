declare function AsyncToGenerator<
    TArgs extends any[],
    TRet,
    >(fn: (...args: TArgs) => Promise<TRet>): (...args: TArgs) => IterableIterator<TRet>;

export = AsyncToGenerator;
