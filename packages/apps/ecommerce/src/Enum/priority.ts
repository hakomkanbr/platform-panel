export enum DiscountPriority {
  Low = 10,
  Normal = 50,
  High = 100,
  Critical = 1000,
}

export const DiscountPriorityOptions = [
  { value: DiscountPriority.Low, label: "🟢 Düşük Öncelik" },
  { value: DiscountPriority.Normal, label: "🔵 Normal Öncelik" },
  { value: DiscountPriority.High, label: "🟠 Yüksek Öncelik" },
  { value: DiscountPriority.Critical, label: "🔴 Kritik (En Yüksek)" },
];