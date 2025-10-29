import express from 'express';

const router = express.Router();

// Get all farmers
router.get('/', (req: express.Request, res: express.Response) => {
  // For development without database, return mock data
  const mockFarmers = [
    { id: 1, name: 'Jean Baptiste', email: 'jean@example.com', createdAt: new Date().toISOString(), location: 'Kigali', farmSize: 2.5, crops: 'Irish Potatoes, Maize, Beans', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 788 123 456' },
    { id: 2, name: 'Marie Claire', email: 'marie@example.com', createdAt: new Date().toISOString(), location: 'Musanze', farmSize: 1.8, crops: 'Tea, Pyrethrum, Vegetables', profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 789 234 567' },
    { id: 3, name: 'Pierre Nkurunziza', email: 'pierre@example.com', createdAt: new Date().toISOString(), location: 'Huye', farmSize: 3.2, crops: 'Coffee, Bananas, Cassava', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 790 345 678' },
    { id: 4, name: 'Grace Uwimana', email: 'grace@example.com', createdAt: new Date().toISOString(), location: 'Rubavu', farmSize: 2.1, crops: 'Rice, Sweet Potatoes, Tomatoes', profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 791 456 789' },
    { id: 5, name: 'Joseph Mugabo', email: 'joseph@example.com', createdAt: new Date().toISOString(), location: 'Nyamagabe', farmSize: 4.0, crops: 'Sorghum, Millet, Groundnuts', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 792 567 890' },
    { id: 6, name: 'Annette Mukamana', email: 'annette@example.com', createdAt: new Date().toISOString(), location: 'Kayonza', farmSize: 1.5, crops: 'Maize, Beans, Soybeans', profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 793 678 901' },
    { id: 7, name: 'Emmanuel Ndayishimiye', email: 'emmanuel@example.com', createdAt: new Date().toISOString(), location: 'Gicumbi', farmSize: 2.8, crops: 'Irish Potatoes, Cabbage, Carrots', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 794 789 012' },
    { id: 8, name: 'Jeannette Uwimana', email: 'jeannette@example.com', createdAt: new Date().toISOString(), location: 'Ruhango', farmSize: 1.9, crops: 'Tea, Coffee, Passion Fruit', profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 795 890 123' },
    { id: 9, name: 'Patrick Niyonzima', email: 'patrick@example.com', createdAt: new Date().toISOString(), location: 'Bugesera', farmSize: 3.5, crops: 'Rice, Onions, Garlic', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 796 901 234' },
    { id: 10, name: 'Christine Mukantabana', email: 'christine@example.com', createdAt: new Date().toISOString(), location: 'Ngoma', farmSize: 2.3, crops: 'Cassava, Sweet Potatoes, Maize', profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 797 012 345' },
    { id: 11, name: 'Fabrice Nkurunziza', email: 'fabrice@example.com', createdAt: new Date().toISOString(), location: 'Karongi', farmSize: 2.7, crops: 'Bananas, Plantains, Vegetables', profilePicture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 798 123 456' },
    { id: 12, name: 'Angelique Uwimana', email: 'angelique@example.com', createdAt: new Date().toISOString(), location: 'Rusizi', farmSize: 1.6, crops: 'Pineapples, Papaya, Mangoes', profilePicture: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 799 234 567' },
  ];
  res.json(mockFarmers);
});

// Get farmer by ID
router.get('/:id', (req: express.Request, res: express.Response) => {
  // For development without database, return mock data
  const mockFarmers = [
    { id: 1, name: 'Jean Baptiste', email: 'jean@example.com', createdAt: new Date().toISOString(), location: 'Kigali', farmSize: 2.5, crops: 'Irish Potatoes, Maize, Beans', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 788 123 456' },
    { id: 2, name: 'Marie Claire', email: 'marie@example.com', createdAt: new Date().toISOString(), location: 'Musanze', farmSize: 1.8, crops: 'Tea, Pyrethrum, Vegetables', profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 789 234 567' },
    { id: 3, name: 'Pierre Nkurunziza', email: 'pierre@example.com', createdAt: new Date().toISOString(), location: 'Huye', farmSize: 3.2, crops: 'Coffee, Bananas, Cassava', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 790 345 678' },
    { id: 4, name: 'Grace Uwimana', email: 'grace@example.com', createdAt: new Date().toISOString(), location: 'Rubavu', farmSize: 2.1, crops: 'Rice, Sweet Potatoes, Tomatoes', profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 791 456 789' },
    { id: 5, name: 'Joseph Mugabo', email: 'joseph@example.com', createdAt: new Date().toISOString(), location: 'Nyamagabe', farmSize: 4.0, crops: 'Sorghum, Millet, Groundnuts', profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 792 567 890' },
    { id: 6, name: 'Annette Mukamana', email: 'annette@example.com', createdAt: new Date().toISOString(), location: 'Kayonza', farmSize: 1.5, crops: 'Maize, Beans, Soybeans', profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 793 678 901' },
    { id: 7, name: 'Emmanuel Ndayishimiye', email: 'emmanuel@example.com', createdAt: new Date().toISOString(), location: 'Gicumbi', farmSize: 2.8, crops: 'Irish Potatoes, Cabbage, Carrots', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 794 789 012' },
    { id: 8, name: 'Jeannette Uwimana', email: 'jeannette@example.com', createdAt: new Date().toISOString(), location: 'Ruhango', farmSize: 1.9, crops: 'Tea, Coffee, Passion Fruit', profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 795 890 123' },
    { id: 9, name: 'Patrick Niyonzima', email: 'patrick@example.com', createdAt: new Date().toISOString(), location: 'Bugesera', farmSize: 3.5, crops: 'Rice, Onions, Garlic', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 796 901 234' },
    { id: 10, name: 'Christine Mukantabana', email: 'christine@example.com', createdAt: new Date().toISOString(), location: 'Ngoma', farmSize: 2.3, crops: 'Cassava, Sweet Potatoes, Maize', profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 797 012 345' },
    { id: 11, name: 'Fabrice Nkurunziza', email: 'fabrice@example.com', createdAt: new Date().toISOString(), location: 'Karongi', farmSize: 2.7, crops: 'Bananas, Plantains, Vegetables', profilePicture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 798 123 456' },
    { id: 12, name: 'Angelique Uwimana', email: 'angelique@example.com', createdAt: new Date().toISOString(), location: 'Rusizi', farmSize: 1.6, crops: 'Pineapples, Papaya, Mangoes', profilePicture: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=150&h=150&fit=crop&crop=face', phoneNumber: '+250 799 234 567' },
  ];
  const farmer = mockFarmers.find(f => f.id === parseInt(req.params.id || '0'));
  if (!farmer) {
    return res.status(404).json({ error: 'Farmer not found' });
  }
  res.json(farmer);
});

export default router;
