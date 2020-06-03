import {environment} from "../../environments/environment";

export function Environment(atributo: string ) {
  return (target: any, key: string) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, key) || {};
    descriptor.value = environment[atributo];
    Object.defineProperty(target, key, descriptor);
  };
}
