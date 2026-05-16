/**
 * 根据Fiber类型，生成下一层Fiber
 */

import { FunctionComponent, HostComponent } from '@mini-react/shared/workTag';
import { FiberNode } from './FiberNode';
import { updateFunctionComponent } from './updateFunctionComponent';
import { updateHostComponent } from './updateHostComponent';

export function beginWork(
  fiber: FiberNode
): FiberNode | null {
  switch (fiber.tag) {
    case FunctionComponent:
      return updateFunctionComponent(fiber)
    case HostComponent:
      return updateHostComponent(fiber)
    default:
      return null
  }
}