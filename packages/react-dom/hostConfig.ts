import { FiberNode } from '@mini-react/reconciler/FiberNode'
import { HostComponent } from '../shared/workTag'

export type Container = Element

export type Instance = Element

// 创建真实DOM
export function createInstance(
  type: string,
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
      node.tag === HostComponent
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
    }
  }
}