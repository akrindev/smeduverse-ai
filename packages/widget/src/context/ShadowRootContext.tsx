import { createContext, useContext } from "react";

const ShadowRootContext = createContext<ShadowRoot | null>(null);

export const ShadowRootProvider = ShadowRootContext.Provider;

export const useShadowRoot = () => useContext(ShadowRootContext);
