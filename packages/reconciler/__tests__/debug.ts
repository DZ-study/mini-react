import { FiberNode } from '../FiberNode'

export function printFiberTree(
  root: FiberNode
) {

  const visited =
    new Set<FiberNode>()

  function dfs(
    node: FiberNode | null,
    depth: number
  ) {

    if (node === null) {
      return
    }

    /**
     * 检测环
     */
    if (visited.has(node)) {

      console.log(
        '🔴 cycle detected:',
        node.type
      )

      return
    }

    visited.add(node)

    console.log(
      `${' '.repeat(depth * 2)}${node.type}`
    )

    dfs(node.child, depth + 1)

    dfs(node.sibling, depth)
  }

  dfs(root, 0)
}