import unittest
from unittest.mock import patch
from server import sendMessage

class TestTwilioAPI(unittest.TestCase):
    @patch('server.client.messages.create')
    def test_send_message_success(self, mock_create):
        # Arrange
        mock_create.return_value.sid = 'fake_sid'
        to_phone = '+1234567890'
        message = 'Test message'

        # Act
        sendMessage(to_phone, message)

        # Assert
        mock_create.assert_called_once_with(
            body=message,
            from_='YOUR_TWILIO_PHONE_NUMBER',  # Replace with your env or mock
            to=to_phone
        )

    @patch('server.client.messages.create')
    def test_send_message_missing_args(self, mock_create):
        # Act
        sendMessage('', '')

        # Assert
        mock_create.assert_not_called()

if __name__ == '__main__':
    unittest.main() 