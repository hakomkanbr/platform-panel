const points = {
  //dashboard
  dashboardCards: "/Admin/istatics",
  // account
  login: "/Admin/Login",
  parolaUnuttum: "/Admin/ForgotPassword",
  parolaYenile: "/Admin/ResetPassword",
  getSystemLanguage: "/Admin/getSystemLanguage",
  getContentGroup: "/Admin/GetContentGroup",
  getBannerGroup: "/Admin/GetBannerGroup",
  getBlogGroup: "/Admin/Blogs/GetBLogGroup",
  // contents
  getKategoriler: "/Admin/GetCategories",
  getContents: "/Admin/GetContents",
  changeStateContent: "/Admin/SetContentPublishState",
  createContent: "/Admin/CreateContent",
  editContent: "/Admin/EditContent",
  deleteContent: "/Admin/DeleteContent",
  deleteContents: "/Admin/DeleteContents",
  // blog
  getBlogs: "/Admin/Blogs/GetBlogs",
  getBlog: "/Admin/Blogs/GetBlog",
  changeStateBlog: "/Admin/Blogs/SetBlogPublishState",
  createBlog: "/Admin/Blogs/CreateBlog",
  editBlog: "/Admin/Blogs/EditBlog",
  deleteBlog: "/Admin/Blogs/DeleteBlog",
  getBlogCategories: "/Admin/Blogs/GetCategories",
  postBlogCategories: "/Admin/Blogs/CreateCategory",
  editBlogCategories: "/Admin/Blogs/EditCategory",
  deleteBlogCategories: "/Admin/Blogs/DeleteCategory",
  deleteBlogs: "/Admin/Blogs/DeleteBlogs",
  // Manşet
  getMansets: "/Admin/GetMansets", // is changedddddd
  changeStateManset: "/Admin/SetMansetPublishState", // is changedddddd
  changeBannerOrder: "/Admin/ChangeMansetOrder", // is changedddddd
  createManset: "/Admin/CreateManset", // is changedddddd
  editManset: "/Admin/EditManset", // is changedddddd
  getManset: "/Admin/GetManset", // is changedddddd
  deleteManset: "/Admin/DeleteManset", // is changedddddd
  deleteMansets: "/Admin/DeleteMansets", // is changedddddd
  // user
  getUsers: "/Admin/Customer",
  createUser: "/Admin/CreateUser",
  editUser: "/Admin/UpdateUser",
  getUser: "/Admin/GetUser",
  getUserState: "/Admin/SetUserState",
  updateUser: "/Admin/UpdateUser",
  deleteUser: "/Admin/DeleteUser",
  //Roles
  getRoles: "/Admin/GetRoles",
  getRol: "/Admin/GetRole",
  editRol: "/Admin/EditRole",
  createRole: "/Admin/CreateRole",
  deleteRole: "/Admin/DeleteRole",
  getRolList: "/Admin/GetRoleList",
  editRolePermission: "/Admin/EditRolePermissions",
  getPermissions: "/Admin/GePermissions",
  // ayarlar
  getSetting: "/Admin/GetSettings",
  setSetting: "/Admin/SetSettings",
  getProfile: "/Admin/Account/GetProfile",
  updateProfile: "/Admin/Account/UpdateProfile",
  getlogs: "/Admin/GetLogs",
  // Service
  getContacts: "/Admin/GetContacts",
  getContact: "/Admin/GetContact",
  getcontactState: "/Admin/UpdateContactState",
  answerContact: "/Admin/AnswerContact",
  getOption: "/Admin/GetOption",
  setOption: "/Admin/SetOption",

  // CareerForms
  careerForms: "/Admin/CareerForms",
  products: {
    getColors: "/Admin/GetColors",
    getOrders: "/Admin/Orders", // is changedddddd
    getOrder: "/Admin/Orders", // is changedddddd
    getCategories: "/Admin/Categories", // is changedddddd
    reOrderCategori: "/admin/Product/reordercategory",
    getCategory: "/Admin/Categories", // is changedddddd
    createCategory: "/Admin/Categories", // is changedddddd
    updateCategory: "/Admin/Categories", // is changedddddd
    deleteCategory: "/Admin/Categories", // is changedddddd

    getGroup: "/admin/Product/GetGroup",
    getProducts: "/Admin/Products", // is changedddddd
    getProduct: "/Admin/Products", // is changedddddd
    createProduct: "/Admin/Products", // is changedddddd

    setProductPublishState: "/Admin/Products/SetIsPublishable", // is changedddddd
    editProduct: "/Admin/Products", // is changedddddd
    deleteProduct: "/Admin/Products", // is changedddddd
    deleteProducts: "/Admin/Products", // is changedddddd
    updateProductFiles: "/Admin/Products", // is changedddddd
    getProductFiles: "/Admin/Products", // is changedddddd
    changeOrder: "/admin/Product/ChangeOrder",

    // Brands
    getMarkalar: "/Admin/Brands", // is changedddddd
    getMarka: "/Admin/Brands", // is changedddddd
    createMarka: "/Admin/Brands", // is changedddddd
    updateMarka: "/Admin/Brands", // is changedddddd
    deleteMarka: "/Admin/Brands", // is changedddddd
  },

  /// Discounts
  dicounts: {
    getDiscounts: "/Admin/Discounts",
    createDiscount: "/Admin/Discounts",
    getDiscount: "/Admin/Discounts",
    updateDiscount: "/Admin/Discounts",
    statusDiscount: "/Admin/Discounts",
    deleteDiscount: "/Admin/Discounts",
  },

  forms: {
    getForms: "/Plugin/Form/GetForms",
    getSubmissions: "/Plugin/Form/GetSubmissions", // is changedddddd
    deleteForms: "/Plugin/Form/Delete", // is changedddddd
    createForm: "/Plugin/Form/Create", // is changedddddd
  },
};

export default points;
