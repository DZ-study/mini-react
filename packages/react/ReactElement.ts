/**
 * ReactElement是React中用于描述UI的基本单位。ReactElement 是一个普通的 JavaScript 对象，包含了组件类型、属性、子元素等信息。ReactElement 由 React.createElement() 函数创建，或者通过 JSX 语法糖自动转换而来。
 *
 * ReactElement的结构通常如下：
 * {
 *   $$typeof: Symbol.for('react.element'), // 用于标识这是一个 ReactElement
 *   type: 'div' | Component, // 组件类型，可以是字符串（HTML 标签）或函数（自定义组件）
 *   key: string | null, // 用于列表中元素的唯一标识
 *   ref: any, // 用于获取组件实例的引用
 *   props: { ... } // 组件的属性对象，包含了传递给组件的所有属性和子元素
 * }
 *
 * ReactElement 是不可变的，一旦创建就不能修改。React 使用 ReactElement 来描述 UI 的结构，并通过 ReactDOM.render() 将其渲染到 DOM 中。
 *
 * 在 React 中，ReactElement 是构建组件树的基础，每个组件都会返回一个 ReactElement 来描述它的 UI。ReactElement 还支持嵌套，可以包含其他 ReactElement 作为子元素，从而形成复杂的组件树结构。
 *
 * 总之，ReactElement 是 React 中用于描述 UI 的基本单位，它是一个不可变的 JavaScript 对象，包含了组件类型、属性、子元素等信息，是构建组件树的基础。
 */


import { REACT_ELEMENT_TYPE } from '@mini-react/shared/symbols'
import type { ReactElementType } from './types'

/**
 * ReactElement 工厂
 */
function ReactElement(
  type: any,
  key: string | null,
  ref: any,
  props: Record<string, any>
): ReactElementType {
  const element: ReactElementType = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  }
  return element
}

export function createElement(
  type: any,
  config: Record<string, any>,
  ...children: any[]
): ReactElementType {
  let key: string | null = null
  let ref: any = null
  const props: Record<string, any> = {}

  if (config != null) {
    if (config.ref !== undefined) {
      ref = config.ref
    }
    if (config.key !== undefined) {
      key = '' + config.key
    }
    for (const propName in config) {
      if (propName !== 'key' && propName !== 'ref') {
        props[propName] = config[propName]
      }
    }
  }

  if (children.length > 0) {
    props.children = children.length === 1 ? children[0] : children
  }

  return ReactElement(type, key, ref, props)
}

/**
 * 是否合法 element
 */
export function isValidElement(
  object: any
): object is ReactElementType {
  return (
    typeof object === "object" &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  )
}