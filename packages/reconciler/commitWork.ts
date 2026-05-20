import { HostComponent } from '@mini-react/shared/workTag';
import { FiberNode } from './FiberNode';

export function commitRoot(
  root: FiberNode
) {
  const finishedWork = root.child
  if (finishedWork === null) {
    return
  }
  appendPlacementNode(
    finishedWork,
    root.stateNode
  )
}

function appendPlacementNode(
  fiber: FiberNode,
  parent: HTMLElement
) {

  /**
   * HostComponent
   */
  if (
    fiber.tag === HostComponent
  ) {
    parent.appendChild(
      fiber.stateNode
    )
    return
  }

  /**
   * FunctionComponent
   * 继续向下找
   */
  let child = fiber.child
  while (child !== null) {
    appendPlacementNode(
      child, parent
    )
    child = child.sibling
  }
}