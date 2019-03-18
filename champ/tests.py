from django.test import Client
from django.urls import reverse
import unittest
import json

class TestApi(unittest.TestCase):
    def setUp(self):
        self.client = Client()

    def testSeries(self):
        data = {
                "name" : "Test1",
                "date_start"  : "1980-01-01",
                "date_end" : "2000-01-01"
        }
        r = self.client.post(reverse('series'), json.dumps(data), content_type="application/json")
        self.assertEqual(r.status_code, 200)
        response = json.loads(r.content)
        self.assertTrue('id' in response)
        self.assertTrue(response['id'] > 0)
        r1 = self.client.get(reverse('series'))
        self.assertEqual(r1.status_code, 200)
        response1 = json.loads(r1.content)
        self.assertTrue('series' in response1)
        self.assertTrue(len(response1['series']) > 0)
        s = response1['series'][0]
        for k in data.keys():
            self.assertEqual(data[k], s[k])
        
