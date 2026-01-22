export type Refund = {
  id: string
  platform: string
  orderId: string
  orderDateTime: string
  weekKey: string

  totalOrderValue: number
  refundedAmount: number
  itemsRefunded: number

  refundReason: string
  faultSource: string
  managerNotes?: string

  photos: string[]        // ✅ REQUIRED
  createdAt: string
}

export const refunds: Refund[] = []
