import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './FiberNode';

let workInProgress: FiberNode | null = null
let count = 0

/**
 * performUnitOfWork:
 * 处理一个Fiber
 * 找到下一个需要处理的Fiber
 */
export function performUnitOfWork(
  fiber: FiberNode
): FiberNode | null {

  const next = beginWork(fiber) // 返回的是fiber的子节点(fiber),下一个fiber

  fiber.memoizedProps = fiber.pendingProps

  if (next === null) {
    return completeUnitOfWork(fiber)
  }

  return next

  // if (next !== null) {
  //   return next
  // }

  // /**
  //  * 3. 没 child
  //  * 开始回溯
  //  */
  // let node: FiberNode | null = fiber

  // while (node !== null) {
  //   completeWork(node)
  //   /**
  //    * 有 sibling
  //    * 转向兄弟节点
  //    */
  //   if (node.sibling !== null) {
  //     return node.sibling
  //   }

  //   /**
  //    * sibling 也没有
  //    * 回到父节点
  //    */
  //   node = node.return
  // }

  // return null
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

function completeUnitOfWork(
  fiber: FiberNode
): FiberNode | null {
  let node: FiberNode | null = fiber

  do {
    completeWork(node)

    const sibling = node.sibling

    if (sibling !== null) {
      return sibling
    }
    node = node.return

  } while (node !== null)
  return null
}