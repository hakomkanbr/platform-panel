import { validatePageData, sanitizeSlug, generateSlugFromTitle } from '../../../utils/pageValidation';
import { IPageBlock } from '@/types/page';

describe('Page Validation Utils', () => {
  describe('validatePageData', () => {
    it('should validate basic page data correctly', () => {
      const result = validatePageData('Test Page', 'test-page', []);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(1); // warning about no modules
    });

    it('should return errors for invalid data', () => {
      const result = validatePageData('', '', []);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Page title مطلوب');
      expect(result.errors).toContain('Short link مطلوب');
    });

    it('should validate slug format', () => {
      const result = validatePageData('Test', 'Invalid Slug!', []);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Short link يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط');
    });

    it('should detect duplicate singleton modules', () => {
      const modules: IPageBlock[] = [
        {
          id: '1',
          moduleId: 1,
          moduleName: 'Hero',
          moduleSlug: 'hero',
          isSingleton: true,
          order: 0,
          fieldValues: {}
        },
        {
          id: '2',
          moduleId: 1,
          moduleName: 'Hero',
          moduleSlug: 'hero',
          isSingleton: true,
          order: 1,
          fieldValues: {}
        }
      ];

      const result = validatePageData('Test', 'test', modules);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('الوحدة "Hero" من نوع Singleton ولا يمكن إضافتها أكثر من مرة');
    });
  });

  describe('sanitizeSlug', () => {
    it('should sanitize slug correctly', () => {
      expect(sanitizeSlug('Test Page!')).toBe('test-page');
      expect(sanitizeSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(sanitizeSlug('Special@#$Characters')).toBe('specialcharacters');
    });
  });

  describe('generateSlugFromTitle', () => {
    it('should generate slug from Arabic titles', () => {
      expect(generateSlugFromTitle('الرئيسية')).toBe('home');
      expect(generateSlugFromTitle('من نحن')).toBe('about');
      expect(generateSlugFromTitle('الخدمات')).toBe('services');
    });

    it('should generate slug from English titles', () => {
      expect(generateSlugFromTitle('About Us')).toBe('about-us');
      expect(generateSlugFromTitle('Contact Page')).toBe('contact-page');
    });
  });
});