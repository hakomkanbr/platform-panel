const api_points = {
    module: {
        getAll: "/api/v1/cms/modules",
        create: "/api/v1/cms/modules",
        update: "/api/v1/cms/modules/{id}",
        delete: "/api/v1/cms/modules/{id}",

        // Module Fields
        getFields: "/api/v1/cms/modules/{moduleId}/fields",
        getField: "/api/v1/cms/modules/fields/{id}",
        createField: "/api/v1/cms/modules/{moduleId}/fields",
        updateField: "/api/v1/cms/modules/fields/{id}",
        deleteField: "/api/v1/cms/modules/fields/{id}",
    },

    relation: {
        getAll: "/api/v1/cms/pages",
        create: "/api/v1/cms/pages",
        getOne: "/api/v1/cms/pages/{id}",
        update: "/api/v1/cms/pages/{id}",
        delete: "/api/v1/cms/pages/{id}",
    },

    pages: {
        getAll: "/api/v1/cms/pages",
        create: "/api/v1/cms/pages",
        getOne: "/api/v1/cms/pages/{id}",
        update: "/api/v1/cms/pages/{id}",
        delete: "/api/v1/cms/pages/{id}",
    },

    collection: {
        getAll: "/api/v1/cms/collections",
        create: "/api/v1/cms/collections",
        delete: "/api/v1/cms/collections/{id}",
    },

    category: {
        getAll: "/api/v1/cms/categories",
        create: "/api/v1/cms/categories",
        update: "/api/v1/cms/categories/{id}",
        delete: "/api/v1/cms/categories/{id}",
    },

    content: {
        getAll: "/api/v1/cms/contents/module/{moduleId}",
        getOne: "/api/v1/cms/contents/{id}",
        create: "/api/v1/cms/contents",
        update: "/api/v1/cms/contents/{id}",
        delete: "/api/v1/cms/contents/{id}",

        publish: "/api/v1/cms/contents/{id}/publish",
        unpublish: "/api/v1/cms/contents/{id}/unpublish",
    },

    navigation: {
        getAll: "/api/v1/cms/navigations",
        create: "/api/v1/cms/navigations",
        delete: "/api/v1/cms/navigations/{id}",

        createItem: "/api/v1/cms/navigations/items",
        deleteItem: "/api/v1/cms/navigations/items/{id}",
    },

    template: {
        getAll: "/api/v1/management/templates",
        create: "/api/v1/management/templates",
        getOne: "/api/v1/management/templates",
        update: "/api/v1/management/templates",
        delete: "/api/v1/management/templates",
    },

    theme: {
        getAll: "/api/v1/management/themes",
        create: "/api/v1/management/themes",
        getOne: "/api/v1/management/themes",
        update: "/api/v1/management/themes",
        delete: "/api/v1/management/themes",
        activate: "/api/v1/management/themes/{id}/activate",
    },

    menu: {
        getAll: "/api/v1/management/menus",
        create: "/api/v1/management/menus",
        getOne: "/api/v1/management/menus",
        update: "/api/v1/management/menus",
        delete: "/api/v1/management/menus",

        createItem: "/api/v1/management/menus/{menuId}/items",
        updateItem: "/api/v1/management/menus/items/{id}",
        deleteItem: "/api/v1/management/menus/items/{id}",
    },

    component: {
        getAll: "/api/v1/management/components",
        create: "/api/v1/management/components",
        getOne: "/api/v1/management/components",
        update: "/api/v1/management/components",
        delete: "/api/v1/management/components",

        createField: "/api/v1/management/components/{componentId}/fields",
        deleteField: "/api/v1/management/components/fields/{id}",
    },

    preset: {
        getAll: "/api/v1/management/presets",
        install: "/api/v1/management/presets/{slug}/install",
    },

    tag: {
        getAll: "/api/v1/management/tags",
        create: "/api/v1/management/tags",
        getOne: "/api/v1/management/tags",
        delete: "/api/v1/management/tags",
    },
};

export default api_points;