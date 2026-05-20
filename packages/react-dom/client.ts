import { FiberNode } from '@mini-react/reconciler/FiberNode';
import { HostRoot } from '@mini-react/shared/workTag';
import type { ReactElementType } from '@mini-react/react';
import { createFiberFromElement } from '@mini-react/reconciler/createFiber';
import { renderRoot } from '@mini-react/reconciler/renderRoot';

export function createRoot(
  container: Element
) {
  const rootFiber = new FiberNode(
    HostRoot,
    {},
    null
  )

  rootFiber.stateNode = container

  return {
    render(element: ReactElementType) {
      const appFiber =
        createFiberFromElement(
          element
        )
      rootFiber.child =
        appFiber

      appFiber.return =
        rootFiber
      /**
       * 启动 render
       */
      renderRoot(rootFiber)
    }
  }
}