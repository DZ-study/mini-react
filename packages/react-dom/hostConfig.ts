import { FiberNode } from '@mini-react/reconciler/FiberNode'
import { HostComponent, HostText } from '@mini-react/shared/workTag'

export type Container = Element

export type Instance = Element

// 创建真实DOM
export function createInstance(
  type: string,
  // @ts-ignore
  props: any
): Instance {
  const dom = document.createElement(type)

  return dom
}

export function appendInitialChild(
  parent: Instance,
  child: Instance
) {
  parent.appendChild(child)
}

export function appendAllChildren(
  parent: Element,
  fiber: FiberNode
) {
  let node = fiber.child

  while (node !== null) {

    if ( // 最终都会走到原生dom
      node.tag === HostComponent ||
      node.tag === HostText
    ) {
      appendInitialChild(
        parent,
        node.stateNode
      )
    } else if (node.child !== null) {
      node.child.return = node
      node = node.child
      continue
    }

    if (node === fiber) {
      return
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === fiber) {
        return
      }

      node = node.return
    }

    node.sibling.return = node.return
    node = node.sibling
  }
}