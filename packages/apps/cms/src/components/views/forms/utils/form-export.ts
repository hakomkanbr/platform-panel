import { FormSubmission } from "@/types/form";

export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  includeMetadata?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export class FormExportUtil {
  static exportSubmissions(submissions: FormSubmission[], options: ExportOptions) {
    switch (options.format) {
      case 'csv':
        return this.exportToCSV(submissions, options);
      case 'json':
        return this.exportToJSON(submissions, options);
      case 'excel':
        return this.exportToExcel(submissions, options);
      default:
        throw new Error('Unsupported export format');
    }
  }

  private static exportToCSV(submissions: FormSubmission[], options: ExportOptions): string {
    if (submissions.length === 0) return '';

    // Get all unique field names from submissions
    const allFields = new Set<string>();
    submissions.forEach(submission => {
      submission.fieldValues.forEach(fieldValue => allFields.add(fieldValue.fieldName));
    });

    const fieldNames = Array.from(allFields);

    // Create headers
    const headers = [
      'Submission ID',
      'Form Name',
      'Submitted At',
      ...fieldNames,
      ...(options.includeMetadata ? ['IP Address', 'User Agent'] : [])
    ];

    // Create rows
    const rows = submissions.map(submission => {
      const row = [
        submission.id.toString(),
        submission.formName,
        new Date(submission.submittedAt).toLocaleString(),
        ...fieldNames.map((field) => {
          const fieldValue = submission.fieldValues.find(fv => fv.fieldName === field);
          return this.escapeCSVValue(fieldValue?.value || '');
        }),
        ...(options.includeMetadata ? [
          submission.ipAddress || '',
          submission.userAgent || ''
        ] : [])
      ];
      return row;
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  private static exportToJSON(submissions: FormSubmission[], options: ExportOptions): string {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalSubmissions: submissions.length,
      submissions: submissions.map(submission => ({
        id: submission.id,
        formName: submission.formName,
        submittedAt: submission.submittedAt,
        data: Object.fromEntries(submission.fieldValues.map(fv => [fv.fieldName, fv.value])),
        ...(options.includeMetadata && {
          metadata: {
            ipAddress: submission.ipAddress,
            userAgent: submission.userAgent
          }
        })
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  private static exportToExcel(submissions: FormSubmission[], options: ExportOptions): string {
    // For now, return CSV format as Excel can open CSV files
    // In a real implementation, you would use a library like xlsx
    return this.exportToCSV(submissions, options);
  }

  private static escapeCSVValue(value: any): string {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // Escape quotes by doubling them
    return stringValue.replace(/"/g, '""');
  }

  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  static generateFilename(formName: string, format: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedFormName = formName.replace(/[^a-zA-Z0-9]/g, '_');
    return `${sanitizedFormName}_submissions_${timestamp}.${format}`;
  }
}

// Helper function to export form submissions
export const exportFormSubmissions = (
  submissions: FormSubmission[], 
  formName: string,
  options: ExportOptions
) => {
  try {
    const content = FormExportUtil.exportSubmissions(submissions, options);
    const filename = FormExportUtil.generateFilename(formName, options.format);
    
    let mimeType: string;
    switch (options.format) {
      case 'csv':
        mimeType = 'text/csv;charset=utf-8;';
        break;
      case 'json':
        mimeType = 'application/json;charset=utf-8;';
        break;
      case 'excel':
        mimeType = 'application/vnd.ms-excel;charset=utf-8;';
        break;
      default:
        mimeType = 'text/plain;charset=utf-8;';
    }
    
    FormExportUtil.downloadFile(content, filename, mimeType);
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};