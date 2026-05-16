import { FiberNode } from './FiberNode'
import { reconcileChildren } from './reconcileChildren'

/**
 * 宿主环境原生节点
 */
export function updateHostComponent(
  fiber: FiberNode
): FiberNode | null {
  const nextProps = fiber.pendingProps

  const nextChildren =
    nextProps.children

  reconcileChildren(
    fiber,
    nextChildren
  )

  return fiber.child
}