# دليل التصميم - Module Selector للـ Headless CMS

## نظرة عامة على التصميم

تم تطوير تصميم احترافي ومتطور لمكون `ModuleSelector` ليتماشى مع معايير الـ Headless CMS الحديثة، مع التركيز على:

- **تجربة المستخدم المتقدمة**: واجهة بديهية وسهلة الاستخدام
- **التصميم المرئي الاحترافي**: ألوان متدرجة وظلال ناعمة
- **الاستجابة والتفاعل**: أنيميشن سلس وردود فعل بصرية
- **إمكانية الوصول**: دعم كامل لمعايير الوصول

## المكونات الرئيسية

### 1. Header Section (قسم الرأس)
```scss
.module-selector-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
```

**الميزات:**
- خلفية متدرجة أنيقة
- زوايا مدورة (12px)
- ظل ناعم للعمق
- أيقونة تفاعلية مع عداد الوحدات
- حقل بحث متقدم مع فلترة

### 2. Modules Workspace (مساحة العمل)
```scss
.modules-workspace {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
```

**الميزات:**
- منطقة إسقاط تفاعلية
- تأثيرات بصرية عند السحب
- حالة فارغة جذابة
- مؤشرات ترتيب واضحة

### 3. Module Items (عناصر الوحدات)
```scss
.module-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: grab;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  &.dragging {
    transform: rotate(3deg) scale(1.02);
    box-shadow: 0 12px 32px rgba(24, 144, 255, 0.3);
  }
}
```

**الميزات:**
- أنيميشن سلس عند التفاعل
- تأثير رفع عند التمرير
- تأثير دوران عند السحب
- مؤشرات بصرية للحالة
- أزرار عمل منظمة

## نظام الألوان

### الألوان الأساسية
- **Primary Blue**: `#1890ff` - للعناصر التفاعلية الرئيسية
- **Light Blue**: `#40a9ff` - للتدرجات والتأثيرات
- **Success Green**: `#52c41a` - للحالات الإيجابية
- **Warning Orange**: `#faad14` - للتحذيرات
- **Error Red**: `#ff4d4f` - للأخطاء

### الألوان الثانوية
- **Background**: `#f8f9fa` - خلفيات الكروت
- **Border**: `#e8e8e8` - حدود العناصر
- **Text Primary**: `#262626` - النصوص الرئيسية
- **Text Secondary**: `#8c8c8c` - النصوص الثانوية

## التأثيرات البصرية

### الظلال (Shadows)
```scss
// ظل خفيف للكروت
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

// ظل متوسط عند التفاعل
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

// ظل قوي عند السحب
box-shadow: 0 12px 32px rgba(24, 144, 255, 0.3);
```

### التدرجات (Gradients)
```scss
// تدرج الخلفية
background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);

// تدرج الأزرار
background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);

// تدرج منطقة السحب
background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
```

### الانتقالات (Transitions)
```scss
// انتقال سلس للعناصر
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

// انتقال سريع للحقول
transition: all 0.3s ease;
```

## الأنيميشن والحركة

### 1. Module Slide In
```scss
@keyframes moduleSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 2. Module Pulse (أثناء السحب)
```scss
@keyframes modulePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

### 3. Hover Effects
- **رفع العنصر**: `translateY(-2px)`
- **تكبير طفيف**: `scale(1.02)`
- **دوران خفيف**: `rotate(3deg)`

## التصميم المتجاوب

### Mobile (أقل من 768px)
```scss
@media (max-width: 768px) {
  .module-selector-container {
    .module-selector-header,
    .modules-workspace {
      margin: 0 -12px 16px;
      border-radius: 8px;
    }
  }
}
```

**التحسينات:**
- تقليل المسافات الداخلية
- تصغير أحجام الخطوط
- تبسيط التفاعلات
- تحسين اللمس

## إمكانية الوصول

### Focus States
```scss
&:focus-visible {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}
```

### ARIA Labels
- استخدام `aria-label` للأزرار
- `role="button"` للعناصر التفاعلية
- `aria-describedby` للوصف الإضافي

### Keyboard Navigation
- دعم كامل للتنقل بالكيبورد
- مفاتيح الاختصار للعمليات الشائعة
- ترتيب منطقي للـ tab order

## الوضع المظلم (Dark Mode)

```scss
@media (prefers-color-scheme: dark) {
  .module-selector-container {
    .module-selector-header {
      background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%);
      border-color: #434343;
    }
  }
}
```

**الميزات:**
- كشف تلقائي لتفضيل المستخدم
- ألوان متوافقة مع الوضع المظلم
- حفاظ على التباين والوضوح

## أفضل الممارسات

### 1. الأداء
- استخدام `transform` بدلاً من `position` للأنيميشن
- تحسين الانتقالات بـ `cubic-bezier`
- تجنب إعادة الرسم غير الضرورية

### 2. إمكانية الوصول
- ألوان متباينة كافية
- أحجام أهداف لمس مناسبة (44px+)
- نصوص بديلة للأيقونات

### 3. التجربة
- ردود فعل بصرية فورية
- رسائل خطأ واضحة
- حالات تحميل مرئية

## التخصيص

### متغيرات CSS المخصصة
```scss
:root {
  --module-primary-color: #1890ff;
  --module-border-radius: 8px;
  --module-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  --module-transition: all 0.3s ease;
}
```

### إعدادات الثيم
يمكن تخصيص الألوان والمسافات من خلال متغيرات CSS أو إعدادات Ant Design theme.

## الاختبار

### اختبار التفاعل
- اختبار جميع حالات التفاعل
- التأكد من عمل الـ drag & drop
- اختبار الاستجابة على الأجهزة المختلفة

### اختبار إمكانية الوصول
- اختبار التنقل بالكيبورد
- اختبار قارئ الشاشة
- اختبار التباين اللوني

هذا التصميم يوفر تجربة مستخدم متقدمة ومتوافقة مع معايير الـ Headless CMS الحديثة.