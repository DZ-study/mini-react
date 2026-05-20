// react/jsx-runtime.ts

import { REACT_ELEMENT_TYPE } from "@mini-react/shared/symbols"
import type { ReactElementType } from "./types"

/**
 * automatic runtime
 */
export function jsx(
  type: any,
  config: Record<string, any>,
  maybeKey?: string
): ReactElementType {
  let key: string | null = null
  let ref: any = null

  const props: Record<string, any> = {}

  /**
   * Babel 可能单独传 key
   */
  if (maybeKey !== undefined) {
    key = String(maybeKey)
  }

  if (config != null) {
    if (config.key !== undefined) {
      key = String(config.key)
    }

    if (config.ref !== undefined) {
      ref = config.ref
    }

    for (const propName in config) {
      if (
        propName !== "key" &&
        propName !== "ref"
      ) {
        props[propName] = config[propName]
      }
    }
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props
  }
}

/**
 * 多 children
 */
export const jsxs = jsx

/**
 * dev runtime
 */
export function jsxDEV(
  type: any,
  config: Record<string, any>,
  maybeKey?: string,
  source?: any,
  self?: any
): ReactElementType & {
  __source?: any
  __self?: any
} {
  const element = jsx(
    type,
    config,
    maybeKey
  )

  return {
    ...element,
    __source: source,
    __self: self
  }
}

/**
 * JSX 类型声明
 */
export namespace JSX {

  export interface IntrinsicElements {
    div: any
    span: any
    h1: any
    p: any
  }
}