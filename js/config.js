const API_BE_URL = 'http://127.0.0.1:8000';

window.getApiUrl = function(controller = '') {
    // Đảm bảo API_BE_URL không có dấu '/' ở cuối để tránh lỗi '//' khi nối chuỗi
    const base = API_BE_URL.endsWith('/') ? API_BE_URL.slice(0, -1) : API_BE_URL;
    // Đảm bảo controller không có dấu '/' ở đầu nếu base đã xử lý, hoặc thêm vào nếu cần
    const controllerPath = controller.startsWith('/') ? controller.slice(1) : controller;
    return `${base}/${controllerPath}`;
};

window.getSpeakApiBaseUrl = function() {
    return API_BE_URL;
};
