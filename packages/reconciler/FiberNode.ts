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
  return: FiberNode | null = null // 父节点
  child: FiberNode | null = null // 第一个子节点
  sibling: FiberNode | null = null // 兄弟节点
  index: number = 0 // 节点的索引

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

  constructor(
    tag: number,
    pendingProps: any,
    key: string | null
  ) {
    this.tag = tag
    this.pendingProps = pendingProps
    this.key = key

    this.stateNode = null
    this.type = null

    this.return = null
    this.sibling = null
    this.child = null

    this.pendingProps = pendingProps
    this.memoizedProps = null
  }

}