import os
import base64
from odoo import api, models, fields
from odoo import http
import socket
import time
from werkzeug.utils import secure_filename


class MyModuleSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    file_name = fields.Char('SSL File Name:')
    file_path = fields.Char('File 1 Path')
    file_data = fields.Binary('Upload SSL Files:')
    uploaded_files = fields.Text('Uploaded SSL Files:', compute='_compute_uploaded_files', store=True)
    port = fields.Integer('Websocket Port:', help="Enter Websocket port number")
    websocket_status = fields.Selection([
        ('not_started', 'Not Started'),
        ('started', 'Started'),
    ], string='WebSocket Status', compute='_compute_websocket_status', readonly=False)

    @api.depends('port')
    def _compute_websocket_status(self):
        for settings in self:
            if settings.port:
                if self.websocket_script_running_on_port(settings.port):
                    settings.websocket_status = 'started'
                else:
                    settings.websocket_status = 'not_started'
                    print("CRON FOR stat")
            else:
                settings.websocket_status = 'not_started'

    def update_websocket_status(self):
        # Trigger the recomputation of websocket_status
        self._compute_websocket_status()

    def websocket_script_running_on_port(self, port):
        max_retries = 3
        retry_delay = 5  # seconds

        for retry in range(max_retries):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                    sock.settimeout(5)  # Increase the timeout if needed
                    sock.connect(('localhost', port))
                return True
            except (ConnectionRefusedError, TimeoutError, socket.timeout):
                if retry < max_retries - 1:
                    time.sleep(retry_delay)
                else:
                    return False


    @api.depends('file_name', 'file_path', 'uploaded_files')
    def _compute_uploaded_files(self):
        # Get the list of files in the static folder
        upload_folder = os.path.join(
            http.addons_manifest['Shintheo_Websocket']['addons_path'], 'Shintheo_Websocket/static/ssl_files')
        if os.path.exists(upload_folder):
            uploaded_files = os.listdir(upload_folder)
            self.uploaded_files = '\n'.join(uploaded_files)
        else:
            self.uploaded_files = ''

    def set_values(self):
        super(MyModuleSettings, self).set_values()

        if self.file_data:
            filename = secure_filename(self.file_name)

            # Define the path to save the file within your module's static folder
            upload_folder = os.path.join(
                http.addons_manifest['Shintheo_Websocket']['addons_path'], 'Shintheo_Websocket/static/ssl_files')

            # Create the folder if it doesn't exist
            os.makedirs(upload_folder, exist_ok=True)

            # Define the full path for saving the file
            file_path = os.path.join(upload_folder, filename)

            # Save the file to the specified location
            with open(file_path, 'wb') as f:
                f.write(base64.b64decode(self.file_data))

            # Update the settings with the file path
            self.file_path = file_path

        # Set the PORT field value
        self.env['ir.config_parameter'].sudo().set_param('Shintheo_Websocket.port', self.port)

    def get_values(self):
        res = super(MyModuleSettings, self).get_values()
        # Get the PORT field value
        res['port'] = int(self.env['ir.config_parameter'].sudo().get_param('Shintheo_Websocket.port', default=9090))
        return res
