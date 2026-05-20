import { commitRoot } from './commitWork';
import { FiberNode } from './FiberNode';
import { prepareFreshStack, workLoop } from './workLoop';

export function renderRoot(
  root: FiberNode
) {
  prepareFreshStack(root)

  workLoop()

  commitRoot(root)
}