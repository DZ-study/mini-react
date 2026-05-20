import { commitRoot } from './commitWork';
import { FiberNode } from './FiberNode';
import { prepareFreshStack, workLoop } from './workLoop';
import { printFiberTree } from './__tests__/debug';

export function renderRoot(
  root: FiberNode
) {
  prepareFreshStack(root)

  printFiberTree(root)
  workLoop()

  commitRoot(root)
}