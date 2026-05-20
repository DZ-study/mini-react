import type { ReactElementType } from '@mini-react/react'
import { FiberNode } from './FiberNode';
import { FunctionComponent, HostComponent } from '@mini-react/shared/workTag';


export function createFiberFromElement(
  element: ReactElementType
): FiberNode {
  const {
    type,
    key,
    props
  } = element

  let fiberTag = 0

  if (typeof type === 'string') {
    fiberTag = HostComponent
  } else if (typeof type === 'function') {
    fiberTag = FunctionComponent
  }

  const fiber = new FiberNode(fiberTag, props, key)

  fiber.type = type

  return fiber
}