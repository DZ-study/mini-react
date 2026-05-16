import type { ReactElementType } from '../react/types'

export class FiberNode {
  /**
   * Fiber的类型
   */
  tag: number
  /**
   * Fiber对应的ReactElement
   */
  type: any
  /**
   * Fiber对应的ReactElement的key
   */
  key: string | null
  /**
   * Fiber对应的真实DOM节点
   */
  stateNode: any = null
  /**
   * Fiber树结构
   */
  return: FiberNode | null = null
  child: FiberNode | null = null
  sibling: FiberNode | null = null
  index: number = 0

  // 输入Props和状态
  pendingProps: any = null
  // 上一次渲染使用的Props和状态 已完成
  memoizedProps: any = null
  // hooks/state
  memoizedState: any = null
  updateQueue: any = null
  flags: number = 0

  // Fiber树双缓存机制
  alternate: FiberNode | null = null

  //TODO: 为什么实例化只有这几个属性？
  constructor(
    tag: number,
    pendingProps: any,
    key: string | null
  ) {
    this.tag = tag
    this.pendingProps = pendingProps
    this.key = key
  }

}