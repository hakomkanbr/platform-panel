const api_points = {
    module: {
        getAll: "/api/v1/cms/modules",
        create: "/api/v1/cms/modules",
        update: "/api/v1/cms/modules/{id}",
        delete: "/api/v1/cms/modules/{id}",

        // Module Fields
        getFields: "/api/v1/cms/modules/{moduleId}/fields",
        createField: "/api/v1/cms/modules/{moduleId}/fields",
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
};

export default api_points;