export type Props = {
  [key: string]: any;
  children?: Element[];
}

export type ElementType = string | ((props: Props) => Element);

export type Element = {
  type: ElementType;
  props: Props;
}

export type Fiber = {
  type: ElementType;
  props: Props;
  dom: HTMLElement | Text | null;
  parent: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
  effectTag?: 'PLACEMENT' | 'UPDATE' | 'DELETION';
  hooks?: Hook[] | null;
}

interface Hook {
  state: any;
  queue: any[];
}

// ------全局状态------
let wipRoot: Fiber | null = null;
let currentRoot: Fiber | null = null;
let wipFiber: Fiber | null = null;
let hookIndex: number = 0;
const deletions: Fiber[] = [];


function createTextElement(text: string): Element {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

export function createElement(
  type: ElementType,
  props: Props | null,
  ...children: (string | Element)[]
): Element {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'string' ? createTextElement(child) : child
      ),
    }
  }
}

function createDom(fiber: Fiber): HTMLElement | Text {
  const isText = fiber.type === 'TEXT_ELEMENT';
  const dom = isText ? document.createTextNode('') : document.createElement(fiber.type as string)

  // TODO_Q: 为什么通过updateDom创建dom，而不是直接在createDom中创建？
  updateDom(dom, {}, fiber.props);
  return dom;
}

function updateDom(dom: HTMLElement | Text, prevProps: Props, nextProps: Props) {
  // 移除旧事件/属性
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (key.startsWith('on')) {
        const event = key.toLowerCase().substring(2);
        dom.removeEventListener(event, prevProps[key]);
      } else {
        (dom as any)[key] = '';
      }
    }
  });
  // 添加新事件/属性
  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (key.startsWith('on')) {
        const event = key.toLowerCase().substring(2);
        dom.addEventListener(event, nextProps[key]);
      } else {
        (dom as any)[key] = nextProps[key];
      }
    }
  })
}

function reconcileChildren(wipFiber: Fiber, elements: Element[]) {
  let index = 0
  // wipFiber.alternate?.child 是上一次的fiber节点
  let oldChild = wipFiber.alternate?.child || null
  let prevSibling: Fiber | null = null

  while (index < elements.length || oldChild !== null) {
    const element = index < elements.length ? elements[index] : null
    let newFiber: Fiber | null = null

    const sameType = oldChild && element && oldChild.type === element.type

    if (sameType) {
      // 更新
      newFiber = {
        type: oldChild!.type,
        props: element!.props,
        dom: oldChild!.dom,
        parent: wipFiber,
        child: null,
        sibling: null,
        alternate: oldChild,
        effectTag: 'UPDATE',
        hooks: oldChild!.hooks,
      }
    }
    if (element && !sameType) {
      // 添加
      newFiber = {
        type: element.type,
        props: element!.props,
        dom: null,
        parent: wipFiber,
        child: null,
        sibling: null,
        alternate: null,
        effectTag: 'PLACEMENT',
        hooks: null,
      }
    }
    if (oldChild && !sameType) {
      // DELETION
      oldChild.effectTag = 'DELETION';
      deletions.push(oldChild);
    }

    if (oldChild) {
      oldChild = oldChild.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (prevSibling && newFiber) {
      prevSibling.sibling = newFiber;
    }

    if (newFiber) {
      prevSibling = newFiber;
    }
    index++;
  }
}

// 更新原生组件
function updateHostComponent(fiber: Fiber): void {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children || []);
}

// 更新函数组件
function updateFunctionComponent(fiber: Fiber): void {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];

  const children = [(fiber.type as (props: Props) => Element)(fiber.props)];
  reconcileChildren(fiber, children);
}

export function useState(initial: any): [any, (action: any) => void] {
  const oldHook =
    wipFiber?.alternate?.hooks && wipFiber.alternate.hooks[hookIndex];

  const hook: Hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  // 执行 pending updates
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = typeof action === 'function' ? action(hook.state) : action;
  });

  const setState = (action: any) => {
    hook.queue.push(action);
    // 触发重新渲染
    wipRoot = {
      dom: currentRoot?.dom || null,
      props: currentRoot?.props || { children: [] },
      alternate: currentRoot,
      type: 'ROOT',
      parent: null,
      child: null,
      sibling: null,
      hooks: null,
    };
    wipFiber = wipRoot;
    hookIndex = 0;
    workLoop();
  };

  wipFiber!.hooks!.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

function performUnitOfWork(fiber: Fiber): Fiber | null {
  const isFunction = typeof fiber.type === 'function';
  if (isFunction) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // DFS 遍历
  if (fiber.child) return fiber.child;
  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  return null;
}

function workLoop(): void {
  // nextUnitOfWork: 下一个要执行的单元
  let nextUnitOfWork = wipFiber; // 从当前正在构建的fiber开始
  while (nextUnitOfWork) { // 遍历所有要执行的单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); // 执行下一个单元
  }
  commitRoot(); // 提交根fiber
}

function commitRoot(): void {
  deletions.forEach(commitWork);
  commitWork(wipRoot && wipRoot.child ? wipRoot.child : null);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions.length = 0;
}

function commitWork(fiber: Fiber | null): void {
  if (!fiber) return;

  let domParentFiber = fiber.parent;
  while (domParentFiber && !domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber?.dom;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
    domParent?.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
    updateDom(fiber.dom, fiber.alternate?.props || {}, fiber.props);
  } else if (fiber.effectTag === 'DELETION' && fiber.dom) {
    domParent?.removeChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}


export function render(element: Element, container: HTMLElement): void {
  // wipRoot: work in progress root 正在构建的root fiber
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot, // 上一次的fiber树
    type: 'ROOT', // 根fiber
    parent: null,
    child: null,
    sibling: null,
    hooks: null,
  };
  wipFiber = wipRoot; // 设置当前正在构建的fiber
  hookIndex = 0; // 重置hook索引，确保每次渲染都从第一个hook开始
  workLoop();
}