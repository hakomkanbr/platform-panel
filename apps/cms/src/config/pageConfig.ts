export const PAGE_CONFIG = {
  // الحد الأقصى لعدد الوحدات في الصفحة الواحدة
  MAX_MODULES_PER_PAGE: 20,
  
  // الحد الأقصى لطول Page title
  MAX_TITLE_LENGTH: 100,
  
  // الحد الأقصى لطول Short link
  MAX_SLUG_LENGTH: 50,
  
  // أنواع الوحدات المسموحة
  ALLOWED_MODULE_TYPES: [
    'hero',
    'about',
    'services',
    'projects',
    'contact',
    'gallery',
    'testimonials',
    'blog',
    'news'
  ],
  
  // الوحدات الافتراضية للصفحات الجديدة
  DEFAULT_MODULES: [],
  
  // إعدادات Drag & Drop
  DRAG_DROP_CONFIG: {
    enableKeyboardNavigation: true,
    announcements: {
      onDragStart: (id: string) => `بدء سحب الوحدة ${id}`,
      onDragUpdate: (destination: any) => 
        destination ? `نقل إلى الموضع ${destination.index + 1}` : 'خارج المنطقة المسموحة',
      onDragEnd: (result: any) => 
        result.destination ? 'تم النقل بنجاح' : 'تم إلغاء النقل'
    }
  },
  
  // رسائل التحقق المخصصة
  VALIDATION_MESSAGES: {
    TITLE_REQUIRED: 'Page title مطلوب',
    SLUG_REQUIRED: 'Short link مطلوب',
    SLUG_INVALID: 'Short link يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط',
    TITLE_TOO_LONG: `Page title يجب أن يكون أقل من ${100} حرف`,
    SLUG_TOO_LONG: `Short link يجب أن يكون أقل من ${50} حرف`,
    DUPLICATE_SINGLETON: 'هذه الوحدة من نوع Singleton ولا يمكن إضافتها أكثر من مرة',
    NO_MODULES_WARNING: 'لم يتم اختيار أي وحدات للصفحة',
    SINGLETON_NO_VALUES: 'الوحدة من نوع Singleton ولكن لم يتم تكوين قيمها',
    TOO_MANY_MODULES: `عدد الوحدات يتجاوز الحد المسموح (${20})`
  },
  
  // إعدادات واجهة المستخدم
  UI_CONFIG: {
    CARD_BORDER_RADIUS: '8px',
    ANIMATION_DURATION: '0.3s',
    DRAG_HANDLE_COLOR: '#1890ff',
    SUCCESS_COLOR: '#52c41a',
    WARNING_COLOR: '#faad14',
    ERROR_COLOR: '#ff4d4f'
  },
  
  // إعدادات الحفظ التلقائي
  AUTO_SAVE_CONFIG: {
    ENABLED: false,
    INTERVAL: 30000, // 30 ثانية
    SHOW_INDICATOR: true
  }
};

export default PAGE_CONFIG;