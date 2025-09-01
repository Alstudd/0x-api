// Global type declarations for missing modules

declare module 'json-rpc-error' {
  class JsonRpcError extends Error {
    constructor(message: string, code: number, data?: any);
    code: number;
    data?: any;
  }
  export = JsonRpcError;
}

declare module 'chai-bignumber' {
  function chaiBigNumber(BN: any): any;
  export = chaiBigNumber;
}

declare namespace ZenObservable {
  interface Subscription {
    unsubscribe(): void;
    closed: boolean;
  }
  
  interface Observer<T> {
    next?(value: T): void;
    error?(error: any): void;
    complete?(): void;
  }
  
  interface ObservableLike<T> {
    subscribe(observer: Observer<T>): Subscription;
    subscribe(
      onNext?: (value: T) => void,
      onError?: (error: any) => void,
      onComplete?: () => void
    ): Subscription;
  }
}

declare module 'zen-observable' {
  class Observable<T> implements ZenObservable.ObservableLike<T> {
    constructor(init: (observer: ZenObservable.Observer<T>) => void | (() => void));
    subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription;
    subscribe(
      onNext?: (value: T) => void,
      onError?: (error: any) => void,
      onComplete?: () => void
    ): ZenObservable.Subscription;
  }
  export = Observable;
}

export {};
