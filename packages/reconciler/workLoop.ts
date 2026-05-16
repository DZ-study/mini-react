import { beginWork } from './beginWork';
import { FiberNode } from './FiberNode';

let workInProgress: FiberNode | null = null

/**
 * performUnitOfWork:
 * 处理一个Fiber
 * 找到下一个需要处理的Fiber
 */
export function performUnitOfWork(
  fiber: FiberNode
): FiberNode | null {
  const next = beginWork(fiber) // 返回的是fiber的子节点

  fiber.memoizedProps = fiber.pendingProps

  if (next !== null) {
    return next
  }

  /**
   * 3. 没 child
   * 开始回溯
   */
  let node: FiberNode | null = fiber

  while (node !== null) {
    /**
     * 有 sibling
     * 转向兄弟节点
     */
    if (node.sibling !== null) {
      return node.sibling
    }

    /**
     * sibling 也没有
     * 回到父节点
     */
    node = node.return
  }

  return null
}

export function workLoop() {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress)
  }
}


export function prepareFreshStack(
  root: FiberNode
) {
  workInProgress = root
}