export interface ReactElementType {
  $$typeof: symbol
  type: any
  key: string | null
  ref: any
  props: Record<string, any>
}