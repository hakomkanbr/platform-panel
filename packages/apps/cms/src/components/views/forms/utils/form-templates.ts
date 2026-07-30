import { IField } from "@/types/page";

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: IField[];
  icon?: string;
}

export const formTemplates: FormTemplate[] = [
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Basic contact form with name, email, and message fields',
    category: 'General',
    icon: '📧',
    fields: []
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup',
    description: 'Simple newsletter subscription form',
    category: 'Marketing',
    icon: '📰',
    fields: []
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'Comprehensive job application form',
    category: 'HR',
    icon: '💼',
    fields: [ ]
  },
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Event registration form with attendee details',
    category: 'Events',
    icon: '🎟️',
    fields: []
  },
  {
    id: 'feedback-survey',
    name: 'Feedback Survey',
    description: 'Customer feedback and satisfaction survey',
    category: 'Survey',
    icon: '📊',
    fields: []
  },
  {
    id: 'support-ticket',
    name: 'Support Ticket',
    description: 'Customer support request form',
    category: 'Support',
    icon: '🎧',
    fields: []
  }
];

export const getTemplatesByCategory = () => {
  const categories: Record<string, FormTemplate[]> = {};
  
  formTemplates.forEach(template => {
    if (!categories[template.category]) {
      categories[template.category] = [];
    }
    categories[template.category].push(template);
  });
  
  return categories;
};

export const getTemplateById = (id: string): FormTemplate | undefined => {
  return formTemplates.find(template => template.id === id);
};

export const searchTemplates = (query: string): FormTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return formTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.category.toLowerCase().includes(lowercaseQuery)
  );
};