import { createFiberFromElement } from './createFiber';
import { FiberNode } from './FiberNode';

/**
 * 创建子Fiber
 * 关联一个节点的父节点、兄弟节点、第一个子节点、索引
 * @param returnFiber 父节点
 * @param children 子节点，可以是单个ReactElement，也可以是一个数组
 */
export function reconcileChildren(
  returnFiber: FiberNode,
  children: any
) {
  // 单节点
  if (typeof children === "object" && children !== null) {
    const childFiber = createFiberFromElement(children)
    childFiber.return = returnFiber // 父子关系
    returnFiber.child = childFiber
    return
  }

  // 数组
  if (Array.isArray(children)) {
    let previousFiber: FiberNode | null = null

    children.forEach((child, index) => {
      const childFiber = createFiberFromElement(child)
      childFiber.return = returnFiber
      childFiber.index = index

      if (index === 0) { // 每个节点只关联第一个子节点
        returnFiber.child = childFiber
      } else if (previousFiber) {
        previousFiber.sibling = childFiber
      }

      previousFiber = childFiber
    })
  }
}