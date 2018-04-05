'use strict';
module.exports = function(app) {
    var api_ = require('../controllers/api_Controller');

    // api_ Routes
    app.route('/tasks')
        .get(api_.list_all_tasks)
        .post(api_.create_a_task);


    app.route('/tasks/:taskId')
        .get(api_.read_a_task)
        .put(api_.update_a_task)
        .delete(api_.delete_a_task);
};
