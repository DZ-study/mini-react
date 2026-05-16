import { FiberNode } from './FiberNode'
import { reconcileChildren } from './reconcileChildren'

export function updateFunctionComponent(
  fiber: FiberNode
): FiberNode | null {
  const Component = fiber.type
  // Fiber有双缓存的概念，pendingProps是即将处理的新prps，memoizedProps是已完成渲染的旧props
  const props = fiber.pendingProps

  const children = Component(props)

  reconcileChildren(fiber, children)

  return fiber.child
}