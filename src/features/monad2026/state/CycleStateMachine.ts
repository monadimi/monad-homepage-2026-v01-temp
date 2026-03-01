// 3초 주기의 순환 상태를 캡슐화한 상태 머신입니다.
import type { CycleItem } from '../data/cycleData'

export class CycleStateMachine {
  private readonly items: readonly CycleItem[]

  private readonly intervalMs: number

  public constructor(items: readonly CycleItem[], intervalMs = 3000) {
    this.items = items
    this.intervalMs = intervalMs
  }

  public getItems(): readonly CycleItem[] {
    return this.items
  }

  public getIntervalMs(): number {
    return this.intervalMs
  }

  public getInitialIndex(): number {
    return 0
  }

  public getItemByIndex(index: number): CycleItem {
    return this.items[index]
  }

  public getNextIndex(index: number): number {
    return (index + 1) % this.items.length
  }
}
