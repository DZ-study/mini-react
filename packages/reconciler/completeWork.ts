import { FunctionComponent, HostComponent, HostRoot } from '@mini-react/shared/workTag';
import { FiberNode } from './FiberNode';
import { appendAllChildren, createInstance } from '@mini-react/react-dom/hostConfig';

export function completeWork(
  fiber: FiberNode
) {
  const newProps = fiber.pendingProps

  switch (fiber.type) {
    case HostComponent:
      const instance = createInstance(fiber.type, newProps)

      appendAllChildren(instance, fiber)

      fiber.stateNode = instance

      return
    case HostRoot:
    case FunctionComponent:
      return
  }

}