import unittest
from server import app

class TestServerEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_lock_in_success(self):
        # Arrange
        data = {'status': 'locked_in'}

        # Act
        response = self.client.post('/api/lock-in', json=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIn('User locked in successfully', response.get_data(as_text=True))

    def test_lock_in_failure(self):
        # Arrange
        data = {'status': 'not_locked_in'}

        # Act
        response = self.client.post('/api/lock-in', json=data)

        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid status', response.get_data(as_text=True))

    def test_image_endpoint_with_image(self):
        # Arrange: Use a small test image in base64
        with open('test_imgs/sample.jpg', 'rb') as img_file:
            import base64
            img_b64 = 'data:image/jpeg;base64,' + base64.b64encode(img_file.read()).decode()
        data = {'image': img_b64, 'phoneNumber': '1234567890'}

        # Act
        response = self.client.post('/api/image', json=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.get_json())

    def test_image_endpoint_invalid(self):
        # Act
        response = self.client.post('/api/image', json={})

        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid image', response.get_data(as_text=True))

if __name__ == '__main__':
    unittest.main() 