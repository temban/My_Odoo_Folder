from odoo import http
from odoo.http import request
import os
from werkzeug.utils import secure_filename


class CustomFileController(http.Controller):
    @http.route('/custom_file_upload/upload', type='http', auth="public", website=True, csrf=False)
    def upload_file(self, **kw):
        return request.render('Shintheo_Websocket.file_upload_page')

    @http.route('/custom_file_upload/save', type='http', auth="public", methods=['POST'], website=True, csrf=False)
    def save_file(self, **kw):
        file_data = kw.get('file_data')
        file_name = kw.get('file_name')

        if file_data:
            # Ensure that the filename is safe
            filename = secure_filename(file_name)
            # Define the path to save the file within your module's static folder
            upload_folder = os.path.join(
                http.addons_manifest['Shintheo_Websocket']['addons_path'], 'Shintheo_Websocket/static/ssl_files')

            # Create the folder if it doesn't exist
            os.makedirs(upload_folder, exist_ok=True)

            # Define the full path for saving the file
            file_path = os.path.join(upload_folder, filename)

            # Save the file to the specified location
            with open(file_path, 'wb') as f:
                f.write(file_data.read())

            # Create a record for the uploaded file in the custom.file model
            request.env['res.config.settings'].sudo().create({'name': filename, 'file_path': file_path})

        return request.redirect('/custom_file_upload/upload')