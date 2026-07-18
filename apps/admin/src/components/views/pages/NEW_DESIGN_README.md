# التصميم الجديد - Module Selector بنظام القسمين

## نظرة عامة

تم إعادة تصميم مكون `ModuleSelector` بالكامل ليعمل بنظام القسمين مع drag & drop محسن، مما يوفر تجربة مستخدم أكثر بديهية وفعالية.

## الميزات الجديدة

### 🎯 **نظام القسمين**
- **القسم الأيسر**: Available units مع إمكانية البحث والفلترة
- **القسم الأيمن**: Selected units مع إمكانية إعادة الترتيب

### 🎨 **التصميم المحسن**
- كروت أنيقة مع تأثيرات hover متطورة
- ألوان مميزة لكل قسم (أزرق للمتاحة، أخضر للمختارة)
- أنيميشن سلس عند السحب والإفلات
- مؤشرات بصرية واضحة للحالة

### 🔄 **Drag & Drop متقدم**
- سحب من Available units إلى المختارة
- إعادة ترتيب Selected units
- تأثيرات بصرية مختلفة لكل نوع سحب
- منع السحب للوحدات المعطلة (Singleton المكررة)

## البنية الجديدة

### القسم الأيسر - Available units
```tsx
<Card className="available-modules-panel">
  <Search placeholder="البحث في الوحدات..." />
  <Droppable droppableId="available-modules" isDropDisabled={true}>
    {/* قائمة Available units */}
  </Droppable>
</Card>
```

**الميزات:**
- بحث فوري في الوحدات
- عرض معلومات الوحدة (الاسم، الـ slug)
- مؤشر Singleton
- تعطيل الوحدات المكررة
- تأثير دوران عند السحب

### القسم الأيمن - Selected units
```tsx
<Card className="selected-modules-panel">
  <Droppable droppableId="selected-modules">
    {/* قائمة Selected units */}
  </Droppable>
</Card>
```

**الميزات:**
- منطقة إسقاط تفاعلية
- ترقيم تلقائي للوحدات
- مؤشرات حالة التكوين
- أزرار العمل (تكوين، حذف)
- إعادة ترتيب سلسة

## التفاعلات المدعومة

### 1. السحب من المتاحة إلى المختارة
```typescript
// التحقق من Singleton
if (module.isSingleton && selectedModules.some(m => m.moduleId === module.id)) {
  message.warning('هذه الوحدة يمكن إضافتها مرة واحدة فقط');
  return;
}

// إضافة الوحدة الجديدة
const newModule: IPageModule = {
  id: `${module.id}-${Date.now()}`,
  moduleId: module.id,
  moduleName: module.name,
  moduleSlug: module.slug,
  isSingleton: module.isSingleton,
  order: destination.index,
  fieldValues: {}
};
```

### 2. إعادة ترتيب Selected units
```typescript
const reorderedModules = Array.from(selectedModules);
const [reorderedItem] = reorderedModules.splice(source.index, 1);
reorderedModules.splice(destination.index, 0, reorderedItem);

// تحديث ترقيم الوحدات
const updatedModules = reorderedModules.map((module, index) => ({
  ...module,
  order: index
}));
```

## التصميم البصري

### نظام الألوان
- **Available units**: `#1890ff` (أزرق)
- **Selected units**: `#52c41a` (أخضر)
- **التحذيرات**: `#faad14` (برتقالي)
- **الأخطاء**: `#ff4d4f` (أحمر)

### التأثيرات البصرية
```scss
.available-module-item.dragging .module-card {
  transform: rotate(5deg) scale(1.05);
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.3);
}

.selected-module-item.dragging .module-card {
  transform: rotate(-3deg) scale(1.05);
  box-shadow: 0 12px 32px rgba(82, 196, 26, 0.3);
}
```

### حالات التفاعل
- **Hover**: رفع الكارت مع ظل متدرج
- **Dragging**: دوران وتكبير مع ظل ملون
- **Drop Zone Active**: تغيير لون الخلفية والحدود

## الاستجابة للأجهزة

### الأجهزة اللوحية (768px)
- تحويل التخطيط إلى عمودي
- تقليل ارتفاع الأقسام إلى 50vh
- تحسين المسافات والحشو

### الهواتف المحمولة (480px)
- تصغير أحجام الخطوط
- تقليل المسافات الداخلية
- تبسيط التفاعلات

## الميزات المتقدمة

### 1. البحث الذكي
```typescript
const filtered = availableModules.filter(module =>
  module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  module.slug.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 2. إدارة حالة Singleton
- منع الإضافة المكررة
- فتح نموذج التكوين تلقائياً
- مؤشرات بصرية للحالة

### 3. التكوين التلقائي
```typescript
// فتح نموذج التكوين للوحدات Singleton
if (module.isSingleton) {
  setTimeout(() => {
    setModuleInputs(module.inputs || []);
    setCurrentModule(newModule);
    setConfigModalVisible(true);
  }, 100);
}
```

## أفضل الممارسات

### الأداء
- استخدام `React.memo` للكروت
- تحسين re-renders
- Lazy loading للوحدات الكبيرة

### إمكانية الوصول
- دعم كامل للكيبورد
- ARIA labels مناسبة
- تباين لوني كافي
- أحجام أهداف لمس مناسبة

### تجربة المستخدم
- ردود فعل بصرية فورية
- رسائل خطأ واضحة
- حالات تحميل مرئية
- إرشادات بصرية للمستخدم

## الاختبار

### سيناريوهات الاختبار
1. سحب وحدة عادية من المتاحة إلى المختارة
2. سحب وحدة Singleton (يجب فتح نموذج التكوين)
3. محاولة سحب وحدة Singleton مكررة (يجب منعها)
4. إعادة ترتيب Selected units
5. البحث في Available units
6. حذف وحدة من المختارة
7. تكوين وحدة Singleton

### اختبار الاستجابة
- اختبار على أحجام شاشات مختلفة
- اختبار اللمس على الأجهزة المحمولة
- اختبار التنقل بالكيبورد

هذا التصميم الجديد يوفر تجربة مستخدم متفوقة مع واجهة بديهية وأداء محسن.