import express from 'express';

const router = express.Router();

// Get all farmers
router.get('/', (req: express.Request, res: express.Response) => {
  // For development without database, return mock data
  const mockFarmers = [
    { id: 1, name: 'Jean Baptiste', email: 'jean@example.com', createdAt: new Date().toISOString(), location: 'Kigali', farmSize: 2.5, crops: 'Irish Potatoes, Maize, Beans', profilePicture: '/pictures/farmer%201.jpg', phoneNumber: '+250 788 123 456' },
    { id: 2, name: 'Marie Claire', email: 'marie@example.com', createdAt: new Date().toISOString(), location: 'Musanze', farmSize: 1.8, crops: 'Tea, Pyrethrum, Vegetables', profilePicture: '/pictures/farmer%207.jpg', phoneNumber: '+250 789 234 567' },
    { id: 3, name: 'Pierre Nkurunziza', email: 'pierre@example.com', createdAt: new Date().toISOString(), location: 'Huye', farmSize: 3.2, crops: 'Coffee, Bananas, Cassava', profilePicture: '/pictures/farmer%202.webp', phoneNumber: '+250 790 345 678' },
    { id: 4, name: 'Grace Uwimana', email: 'grace@example.com', createdAt: new Date().toISOString(), location: 'Rubavu', farmSize: 2.1, crops: 'Rice, Sweet Potatoes, Tomatoes', profilePicture: '/pictures/farmer%208.jpg', phoneNumber: '+250 791 456 789' },
    { id: 5, name: 'Joseph Mugabo', email: 'joseph@example.com', createdAt: new Date().toISOString(), location: 'Nyamagabe', farmSize: 4.0, crops: 'Sorghum, Millet, Groundnuts', profilePicture: '/pictures/farmer%203.jpeg', phoneNumber: '+250 792 567 890' },
    { id: 6, name: 'Annette Mukamana', email: 'annette@example.com', createdAt: new Date().toISOString(), location: 'Kayonza', farmSize: 1.5, crops: 'Maize, Beans, Soybeans', profilePicture: '/pictures/farmer%209.webp', phoneNumber: '+250 793 678 901' },
    { id: 7, name: 'Emmanuel Ndayishimiye', email: 'emmanuel@example.com', createdAt: new Date().toISOString(), location: 'Gicumbi', farmSize: 2.8, crops: 'Irish Potatoes, Cabbage, Carrots', profilePicture: '/pictures/farmer%204.jpg', phoneNumber: '+250 794 789 012' },
    { id: 8, name: 'Jeannette Uwimana', email: 'jeannette@example.com', createdAt: new Date().toISOString(), location: 'Ruhango', farmSize: 1.9, crops: 'Tea, Coffee, Passion Fruit', profilePicture: '/pictures/farmer%2010.webp', phoneNumber: '+250 795 890 123' },
    { id: 9, name: 'Patrick Niyonzima', email: 'patrick@example.com', createdAt: new Date().toISOString(), location: 'Bugesera', farmSize: 3.5, crops: 'Rice, Onions, Garlic', profilePicture: '/pictures/farmer%205.jpeg', phoneNumber: '+250 796 901 234' },
    { id: 10, name: 'Christine Mukantabana', email: 'christine@example.com', createdAt: new Date().toISOString(), location: 'Ngoma', farmSize: 2.3, crops: 'Cassava, Sweet Potatoes, Maize', profilePicture: '/pictures/farmer%2011.webp', phoneNumber: '+250 797 012 345' },
    { id: 11, name: 'Fabrice Nkurunziza', email: 'fabrice@example.com', createdAt: new Date().toISOString(), location: 'Karongi', farmSize: 2.7, crops: 'Bananas, Plantains, Vegetables', profilePicture: '/pictures/farmer%206.jpeg', phoneNumber: '+250 798 123 456' },
    { id: 12, name: 'Angelique Uwimana', email: 'angelique@example.com', createdAt: new Date().toISOString(), location: 'Rusizi', farmSize: 1.6, crops: 'Pineapples, Papaya, Mangoes', profilePicture: '/pictures/farmer%2012.jpg', phoneNumber: '+250 799 234 567' },
  ];
  res.json(mockFarmers);
});

// Get farmer by ID
router.get('/:id', (req: express.Request, res: express.Response) => {
  // For development without database, return mock data
  const mockFarmers = [
    { id: 1, name: 'Jean Baptiste', email: 'jean@example.com', createdAt: new Date().toISOString(), location: 'Kigali', farmSize: 2.5, crops: 'Irish Potatoes, Maize, Beans', profilePicture: 'http://localhost:5000/pictures/farmer 1.jpg', phoneNumber: '+250 788 123 456' },
    { id: 2, name: 'Marie Claire', email: 'marie@example.com', createdAt: new Date().toISOString(), location: 'Musanze', farmSize: 1.8, crops: 'Tea, Pyrethrum, Vegetables', profilePicture: 'http://localhost:5000/pictures/farmer 7.jpg', phoneNumber: '+250 789 234 567' },
    { id: 3, name: 'Pierre Nkurunziza', email: 'pierre@example.com', createdAt: new Date().toISOString(), location: 'Huye', farmSize: 3.2, crops: 'Coffee, Bananas, Cassava', profilePicture: 'http://localhost:5000/pictures/farmer 2.webp', phoneNumber: '+250 790 345 678' },
    { id: 4, name: 'Grace Uwimana', email: 'grace@example.com', createdAt: new Date().toISOString(), location: 'Rubavu', farmSize: 2.1, crops: 'Rice, Sweet Potatoes, Tomatoes', profilePicture: 'http://localhost:5000/pictures/farmer 8.jpg', phoneNumber: '+250 791 456 789' },
    { id: 5, name: 'Joseph Mugabo', email: 'joseph@example.com', createdAt: new Date().toISOString(), location: 'Nyamagabe', farmSize: 4.0, crops: 'Sorghum, Millet, Groundnuts', profilePicture: 'http://localhost:5000/pictures/farmer 3.jpeg', phoneNumber: '+250 792 567 890' },
    { id: 6, name: 'Annette Mukamana', email: 'annette@example.com', createdAt: new Date().toISOString(), location: 'Kayonza', farmSize: 1.5, crops: 'Maize, Beans, Soybeans', profilePicture: 'http://localhost:5000/pictures/farmer 9.webp', phoneNumber: '+250 793 678 901' },
    { id: 7, name: 'Emmanuel Ndayishimiye', email: 'emmanuel@example.com', createdAt: new Date().toISOString(), location: 'Gicumbi', farmSize: 2.8, crops: 'Irish Potatoes, Cabbage, Carrots', profilePicture: 'http://localhost:5000/pictures/farmer 4.jpg', phoneNumber: '+250 794 789 012' },
    { id: 8, name: 'Jeannette Uwimana', email: 'jeannette@example.com', createdAt: new Date().toISOString(), location: 'Ruhango', farmSize: 1.9, crops: 'Tea, Coffee, Passion Fruit', profilePicture: 'http://localhost:5000/pictures/farmer 10.webp', phoneNumber: '+250 795 890 123' },
    { id: 9, name: 'Patrick Niyonzima', email: 'patrick@example.com', createdAt: new Date().toISOString(), location: 'Bugesera', farmSize: 3.5, crops: 'Rice, Onions, Garlic', profilePicture: 'http://localhost:5000/pictures/farmer 5.jpeg', phoneNumber: '+250 796 901 234' },
    { id: 10, name: 'Christine Mukantabana', email: 'christine@example.com', createdAt: new Date().toISOString(), location: 'Ngoma', farmSize: 2.3, crops: 'Cassava, Sweet Potatoes, Maize', profilePicture: 'http://localhost:5000/pictures/farmer 11.webp', phoneNumber: '+250 797 012 345' },
    { id: 11, name: 'Fabrice Nkurunziza', email: 'fabrice@example.com', createdAt: new Date().toISOString(), location: 'Karongi', farmSize: 2.7, crops: 'Bananas, Plantains, Vegetables', profilePicture: 'http://localhost:5000/pictures/farmer 6.jpeg', phoneNumber: '+250 798 123 456' },
    { id: 12, name: 'Angelique Uwimana', email: 'angelique@example.com', createdAt: new Date().toISOString(), location: 'Rusizi', farmSize: 1.6, crops: 'Pineapples, Papaya, Mangoes', profilePicture: 'http://localhost:5000/pictures/farmer 12.jpg', phoneNumber: '+250 799 234 567' },
  ];
  const farmer = mockFarmers.find(f => f.id === parseInt(req.params.id || '0'));
  if (!farmer) {
    return res.status(404).json({ error: 'Farmer not found' });
  }
  res.json(farmer);
});

export default router;
