import { IPageBlock } from '@/types/page';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validatePageData = (
  title: string,
  slug: string,
  modules: IPageBlock[],
  languageSlug: string
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // التحقق من البيانات الأساسية
  if (!title || title.trim().length === 0) {
    errors.push('Page title مطلوب');
  }

  // التحقق من البيانات الأساسية
  if (!languageSlug || languageSlug.trim().length === 0) {
    errors.push('لغة الصفحة مطلوبة');
  }

  if (!slug || slug.trim().length === 0) {
    errors.push('Short link مطلوب');
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Short link يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط');
  }

  // التحقق من الوحدات
  if (modules.length === 0) {
    warnings.push('لم يتم اختيار أي وحدات للصفحة');
  }

  // التحقق من الوحدات المكررة
  const moduleIds = modules.map(m => m.moduleId);
  const duplicateIds = moduleIds.filter((id, index) => moduleIds.indexOf(id) !== index);

  if (duplicateIds.length > 0) {
    errors.push('يوجد وحدات مكررة في الصفحة');
  }

  // التحقق من الوحدات Singleton
  modules.forEach((module, index) => {
    if (module.isSingleton) {
      // التحقق من أن الوحدة Singleton لا تتكرر
      const sameModules = modules.filter(m => m.moduleId === module.moduleId);
      if (sameModules.length > 1) {
        errors.push(`الوحدة "${module.moduleName}" من نوع Singleton ولا يمكن إضافتها أكثر من مرة`);
      }

      // التحقق من أن الوحدة Singleton لديها قيم مكونة
      if (!module.fieldValues || Object.keys(module.fieldValues).length === 0) {
        warnings.push(`الوحدة "${module.moduleName}" من نوع Singleton ولكن لم يتم تكوين قيمها`);
      }
    }
  });

  // التحقق من ترتيب الوحدات
  const orders = modules.map(m => m.order);
  const sortedOrders = [...orders].sort((a, b) => a - b);
  const isOrderValid = orders.every((order, index) => order === sortedOrders[index]);

  if (!isOrderValid) {
    warnings.push('ترتيب الوحدات غير صحيح، سيتم إعادة ترتيبها تلقائياً');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const sanitizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '') // ✅ هذا هو الصح
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};


export const generateSlugFromTitle = (title: string): string => {
  // تحويل العنوان العربي إلى slug إنجليزي بسيط
  const arabicToEnglish: { [key: string]: string } = {
    'الرئيسية': 'home',
    'من نحن': 'about',
    'الخدمات': 'services',
    'المشاريع': 'projects',
    'اتصل بنا': 'contact',
    'الأخبار': 'news',
    'المدونة': 'blog'
  };

  const lowerTitle = title.toLowerCase().trim();

  // البحث عن ترجمة مباشرة
  if (arabicToEnglish[lowerTitle]) {
    return arabicToEnglish[lowerTitle];
  }

  // إنشاء slug من العنوان
  return sanitizeSlug(title || 'page');
};