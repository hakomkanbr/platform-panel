const api_points = {
    module : {
        getAll : "/Admin/Modules/GetModules",
        create_update : "/Admin/Modules/CreateUpdate",
        changeState : "/Admin/Modules/ChangeState",
        getOne : "/Admin/Modules/GetOne",
        delete: "/Admin/Modules/Delete",

        // Module Fields
        getFields: "/Admin/Modules/GetFields",
        getField: "/Admin/Modules/GetField",
        createField: "/Admin/Modules/CreateField",
        updateField: "/Admin/Modules/UpdateField",
        deleteField: "/Admin/Modules/DeleteField",
    },
    pages : {
        getAll : "/Admin/page",
        create : "/Admin/page",
        update : "/Admin/page",
        changeState : "/Admin/page/ChangeState",
        getOne : "/Admin/page",
        delete: "/Admin/page"
    },
    webSite : {
        getAll : "/Admin/WebSite/GetAll",
        create : "/Admin/WebSite/Create",
        update : "/Admin/WebSite/Update",
        create_update : "/Admin/WebSite/CreateUpdate",
        changeState : "/Admin/WebSite/ChangeState",
        getOne : "/Admin/WebSite/GetOne",
        delete: "/Admin/WebSite/Delete",
        regenerateApiKey: "/admin/WebSite/UpdateApiKey"
    },
    content : {
        getAll : "/Admin/Content/GetAll",
        update : "/Admin/Content/Update",
        create : "/Admin/Content/Create",
        delete : "/Admin/Content/Delete",
        getOne : "/Admin/Content/GetOne",
        changeState : "/Admin/Content/ChangeState",
    },
    category : {
        getAll : "/Admin/Categories/GetAll",
        getList : "/Admin/Categories/GetList",
        create_update : "/Admin/Categories/Create",
        changeState : "/Admin/Categories/ChangeState",
        delete: "/Admin/Categories/Delete"
    },
    users : {
        getAll : "/Admin/User/GetAll",
        create_update : "/Admin/User/CreateUpdate",
        changeState : "/Admin/User/ChangeState",
        delete: "/Admin/User/Delete",
        getOne : "/Admin/User/GetOne",
        confirmEmail : "/Admin/User/ConfirmEmail",
        sendCode : "/Admin/User/SendCode",
    },
    auth : {
        login : "/Admin/Authenticate/login",
        register : "/Admin/Authenticate/register",
        confirmEmail : "/Admin/Authenticate/ConfirmEmail",
    },
    collection : {
        getAll : "/Admin/Collection",
        create : "/Admin/Collection",
        update : "/Admin/Collection",
        changeState : "/Admin/Collection/ChangeState",
        getOne : "/Admin/Collection",
        delete: "/Admin/Collection"
    },
    navigation : {
        getAll : "/Admin/Navigation",
        create : "/Admin/Navigation",
        update : "/Admin/Navigation",
        getOne : "/Admin/Navigation",
        delete: "/Admin/Navigation"
    },
    relation : {
        getAll : "/admin/Relation",
        create : "/admin/Relation",
        update : "/admin/Relation",
        getOne : "/admin/Relation",
        delete: "/admin/Relation"
    },
    form : {
        getAll : "/admin/Form/GetForms",
        create : "/admin/Form/Create",
        update : "/admin/Form/Update",
        getOne : "/admin/Form/GetOne",
        delete: "/admin/Form/Delete",
        changeState : "/admin/Form/ChangeState",
        getForSelect : "/admin/Form/GetFormsForSelect",
        getStats : "/admin/Form/GetStats",
        // Form Submissions
        getSubmissions : "/admin/Form/GetSubmissions",
        deleteSubmission : "/admin/Form/DeleteSubmission",
        getSubmission : "/admin/Form/GetSubmission",
        exportSubmissions : "/admin/Form/ExportSubmissions"
    },
    service : {
        uploadFile : "/Admin/Service/UploadFile",
        // Social Media
        addUpdateSocial : "/Admin/Service/AddUpdateSocialMedia",
        getSocials : "/Admin/Service/GetSocials",
        // Language
        addUpdateLanguage : "/Admin/Service/AddUpdateLanguage",
        getLanguageList : "/Admin/Service/GetLanguageList",
        deleteLanguage : "/Admin/Service/DeleteLanguage",
    },
    apiKeys : {
        list : "/api/v1/projects/{projectId}/api-keys",
        create : "/api/v1/projects/{projectId}/api-keys",
        getOne : "/api/v1/projects/{projectId}/api-keys/{id}",
        update : "/api/v1/projects/{projectId}/api-keys/{id}",
        delete : "/api/v1/projects/{projectId}/api-keys/{id}",
        rotate : "/api/v1/projects/{projectId}/api-keys/{id}/regenerate",
        revoke : "/api/v1/projects/{projectId}/api-keys/{id}/revoke",
        disable : "/api/v1/projects/{projectId}/api-keys/{id}/disable",
        enable : "/api/v1/projects/{projectId}/api-keys/{id}/enable",
        auditLog : "/api/v1/projects/{projectId}/api-keys/{id}/audit-log",
    },
    projectLanguages : {
        list : "/api/v1/languages/by-project/{projectId}",
        create : "/api/v1/languages",
        update : "/api/v1/languages/{id}",
        delete : "/api/v1/languages/{id}",
        reorder : "/api/v1/languages/reorder",
        setDefault : "/api/v1/languages/{id}/default",
        enable : "/api/v1/languages/{id}/enable",
        disable : "/api/v1/languages/{id}/disable",
    },
};

export default api_points;